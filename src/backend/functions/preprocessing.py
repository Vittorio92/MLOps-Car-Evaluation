import logging
import io
import pandas as pd
import azure.functions as func
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
import joblib
import os

from function_app import app
from shared.storage import get_blob_service
from shared.config import (
    CLEAN_DATA_CONTAINER, MODEL_CONTAINER, PREPROCESSOR_NAME, NAME_PROCESSED_DATASET
)

@app.function_name(name="preprocessingFunctionEventGrid")
@app.event_grid_trigger(arg_name="event", auth_level=func.AuthLevel.ANONYMOUS)
def preprocessfunction(event: func.EventGridEvent):
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

    data_bytes = blob_client.download_blob().readall()
    data_str = data_bytes.decode('utf-8')

    # Carico i dati in un DataFrame pandas aggiungendo l'header alle colonne
    columns = ['buying', 'maint', 'doors', 'persons', 'lug_boot', 'safety', 'class']
    df = pd.read_csv(io.StringIO(data_str), names=columns)
    logging.info(f"Dataset originale: {df.shape[0]} righe, {df.shape[1]} colonne")

    # Rimozione delle righe con valori nulli, se ci sono
    df = df.dropna()
    logging.info(f"Dopo rimozione valori nulli: {df.shape[0]} righe")

    # Separazione delle features dal target
    X = df.drop('class', axis=1)
    y = df['class']

    # Gestione delle feature
    categorical_cols = X.columns.tolist()
    preprocessor = ColumnTransformer(transformers=[('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)])
    X_transformed = preprocessor.fit_transform(X)

    # Riassegno i nomi delle colonne
    ohe_cols = preprocessor.get_feature_names_out()
    df_transformed = pd.DataFrame(X_transformed.toarray(), columns=ohe_cols)
    df_transformed['class'] = y.values
    logging.info(f"Dataset trasformato: {df_transformed.shape[0]} righe, {df_transformed.shape[1]} colonne")

    # Salvataggio dataset pronto in un nuovo blob
    output_csv = df_transformed.to_csv(index=False).encode("utf-8")
    clean_container_client = bsc.get_container_client(CLEAN_DATA_CONTAINER)
    clean_container_client.upload_blob(name=NAME_PROCESSED_DATASET, data=output_csv, overwrite=True)
    logging.info(f"Blob con il dataset pulito salvato in {CLEAN_DATA_CONTAINER}/{NAME_PROCESSED_DATASET}")

    # Salvataggio anche del preprocessor
    model_bytes = io.BytesIO()
    joblib.dump(preprocessor, model_bytes)
    model_bytes.seek(0)
    model_container_client = bsc.get_container_client(MODEL_CONTAINER)
    model_container_client.upload_blob(name=PREPROCESSOR_NAME, data=model_bytes, overwrite=True)
    logging.info(f"Blob con il preprocessing salvato in {MODEL_CONTAINER}/{PREPROCESSOR_NAME}")
