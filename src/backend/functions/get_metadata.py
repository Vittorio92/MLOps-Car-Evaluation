import logging
import io
import json
import pandas as pd
import azure.functions as func
import os
from shared.config import RAW_DATA_CONTAINER, DATASET_NAME
from shared.storage import get_blob_service


get_metadata = func.Blueprint()


@get_metadata.route(route="get_metadata", auth_level=func.AuthLevel.ANONYMOUS, methods=["GET"])
def get_metadata(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger. Lettura informazioni del dataset')
    
    try:
        # Lettura del blob contenente il dataset
        conn_str = os.environ["AzureWebJobsStorage"]
        bsc = get_blob_service(conn_str)
        blob_client = bsc.get_blob_client(container=RAW_DATA_CONTAINER, blob=DATASET_NAME)

        # Lettura delle proprietà del blob e di alcune info del dataset
        metadata = blob_client.get_blob_properties()
        blob = blob_client.download_blob().readall().decode('utf-8')
        columns = ['buying', 'maint', 'doors', 'persons', 'lug_boot', 'safety', 'class']
        df = pd.read_csv(io.StringIO(blob), names=columns)
        n_row = df.shape[0]
        n_col = df.shape[1]-1
        logging.info(f"Dataset originale: {n_row} righe, {n_col} colonne")

        # Invio dei risultati
        result = {
            "name": str(metadata.name),
            "size": str(metadata.size),
            "last_modified": metadata.last_modified.strftime("%Y-%m-%d %H:%M:%S"),
            "n_row": str(n_row),
            "n_col": str(n_col)
        }

        return func.HttpResponse(
            json.dumps(result, indent=2),
            mimetype="application/json",
            status_code=200
        )
    
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
