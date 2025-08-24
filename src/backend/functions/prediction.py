import logging
import io
import json
import os
import pandas as pd
import joblib
import azure.functions as func
from shared.config import MODEL_CONTAINER, MODEL_NAME, PREPROCESSOR_NAME
from shared.storage import get_blob_service


prediction = func.Blueprint()


@prediction.route(route="prediction", methods=["POST"])
def prediction(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger. Esecuzione della predizione')

    logging.info("Connessione ad Azure Blob Storage...")

    # Lettura del modello e del preprocessing dei dati
    connection_string = os.environ["AzureWebJobsStorage"]
    bsc = get_blob_service(connection_string)
    
    model_blob = bsc.get_blob_client(container=MODEL_CONTAINER, blob=MODEL_NAME).download_blob().readall()
    preprocessor_blob = bsc.get_blob_client(container=MODEL_CONTAINER, blob=PREPROCESSOR_NAME).download_blob().readall()
    model = joblib.load(io.BytesIO(model_blob))
    preprocessor = joblib.load(io.BytesIO(preprocessor_blob))
    
    if model is None or preprocessor is None:
        return func.HttpResponse(
                json.dumps({{"error": "Modello non presente"}}),
                status_code=400,
                mimetype="application/json"
            )
    logging.info("Modello e preprocessor caricati in memoria.")

    try:
        # Lettura dei dati nella richiesta. Dati provenienti come JSON
        try:
            data = req.get_json()
        except ValueError:
            return func.HttpResponse(
                json.dumps({{"error": "Body non in formato JSON"}}),
                status_code=400,
                mimetype="application/json"
            )
        if not data:
            return func.HttpResponse(
                json.dumps({{"error": "Nessun dato ricevuto"}}),
                status_code=400,
                mimetype="application/json"
            )
        logging.info("Dati letti correttamente.")
        logging.info(str(data))

        # Esecuzione della predizione
        df = pd.DataFrame([data])
        df_transformed = preprocessor.transform(df)
        if hasattr(preprocessor, "get_feature_names_out"):
            feature_names = preprocessor.get_feature_names_out()
            df_transformed = pd.DataFrame(df_transformed.toarray(), columns=feature_names)

        pred = model.predict(df_transformed)

        logging.info("Predizione avvenuta correttamente")
        return func.HttpResponse(
            json.dumps({{"prediction": pred[0]}}),
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        return func.HttpResponse(
            json.dumps({{"error": str(e)}}),
            status_code=500,
            mimetype="application/json"
        )
