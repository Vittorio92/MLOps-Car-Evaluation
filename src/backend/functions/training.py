import logging
import io
import os
import pandas as pd
import azure.functions as func
import joblib
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline

from function_app import app
from shared.storage import get_blob_service
from shared.config import MODEL_CONTAINER, MODEL_NAME

@app.function_name(name="trainingFunctionEventGrid")
@app.event_grid_trigger(arg_name="event", auth_level=func.AuthLevel.ANONYMOUS)
def trainingfunction(event: func.EventGridEvent):
    logging.info(f"Evento ricevuto: {event.event_type}")

    # Recupero i dati del blob dall'evento e lo leggo
    event_data = event.get_json()
    blob_url = event_data.get("url")
    if not blob_url:
        logging.warning("Nessun URL blob trovato nell'evento")
        return
    logging.info(f"Blob URL: {blob_url}")

    path_parts = blob_url.split("/")
    container_name = path_parts[-2]
    blob_name = path_parts[-1]

    connect_str = os.environ["AzureWebJobsStorage"]
    bsc = get_blob_service(connect_str)
    container_client = bsc.get_container_client(container_name)
    blob_client = container_client.get_blob_client(blob_name)

    # Scarico il dataset dal blob e lo inserisco in un  DataFrame
    data_bytes = blob_client.download_blob().readall()
    data_str = data_bytes.decode('utf-8')
    df = pd.read_csv(io.StringIO(data_str))
    logging.info(f"Dataset caricato: {df.shape[0]} righe, {df.shape[1]} colonne")

    # Separazione delle features dal target
    X = df.drop('class', axis=1)
    y = df['class']

    # Creazione e training  del modello con Rete Neurale
    # Pipeline: preprocessing → scaling → rete neurale
    categorical_cols = X.columns.tolist()
    preprocessor = ColumnTransformer(
        transformers=[('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)]
    )

    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('scaler', StandardScaler(with_mean=False)),
        ('model', MLPClassifier(
            hidden_layer_sizes=(20,10),
            activation="tanh",
            solver="lbfgs",
            max_iter=1000,
            random_state=42
        ))
    ])
    
    model.fit(X, y)
    logging.info("Training completato con successo.")

    # Serializzazione modello
    model_bytes = io.BytesIO()
    joblib.dump(model, model_bytes)
    model_bytes.seek(0)

    # Salvataggio del modello nel container
    model_container_client = bsc.get_container_client(MODEL_CONTAINER)
    model_container_client.upload_blob(name=MODEL_NAME, data=model_bytes, overwrite=True)
    logging.info(f"Modello salvato in {MODEL_CONTAINER}/{MODEL_NAME}")
