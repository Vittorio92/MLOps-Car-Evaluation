import logging
import json
import azure.functions as func
from function_app import app
from shared.config import MODEL_CONTAINER, MODEL_NAME
from shared.storage import get_blob_service
import os

@app.route(route="isModel", methods=["GET"])
def isModel(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger. Verifica della presenza del modello')
    
    try:
        # Connessione a Blob Storage
        connect_str = os.environ["AzureWebJobsStorage"]
        bsc = get_blob_service(connect_str)
        container_client = bsc.get_container_client(MODEL_CONTAINER)

        # 🔹 Controllo se il blob esiste
        blob_client = container_client.get_blob_client(MODEL_NAME)
        if blob_client.exists():
            logging.info("Modello trovato")
            return func.HttpResponse("Modello presente e funzionante", status_code=200)
        else:
            logging.info("Modello non trovato")
            return func.HttpResponse("Modello non trovato", status_code=404)
        
    except Exception as e:
        logging.error(str(e))
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )
