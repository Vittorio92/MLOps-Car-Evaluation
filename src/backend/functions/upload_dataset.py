import logging
import azure.functions as func
from requests_toolbelt.multipart import decoder
from function_app import app
from shared.config import RAW_DATA_CONTAINER, DATASET_NAME

@app.route(route="upload_dataset", methods=["POST"])
@app.blob_output(arg_name="dataset_blob", path=RAW_DATA_CONTAINER + "/" + DATASET_NAME, connection="AzureWebJobsStorage")
def upload_dataset(req: func.HttpRequest, dataset_blob: func.Out[str]) -> func.HttpResponse:
    logging.info('Python HTTP trigger. Caricamento del dataset')

    try:
        # Recupero del file dal body della richiesta
        body = req.get_body()
        content_type = req.headers.get('Content-Type')

        if not body or not content_type:
            return func.HttpResponse("Nessun file trovato", status_code=400)

        # Decodifica il multipart/form-data
        multipart_data = decoder.MultipartDecoder(body, content_type)

        file_found = False
        for part in multipart_data.parts:
            content_disposition = part.headers.get(b'Content-Disposition', b'').decode()
            # Cerco il file
            if 'name="file"' in content_disposition:
                file_content = part.content

                # Salvataggio del dataset nel blob 
                dataset_blob.set(file_content)
                file_found = True
                logging.info(f"Dataset caricato con successo")
                return func.HttpResponse("Dataset caricato con successo.", status_code=200)
        if not file_found:
            return func.HttpResponse("Nessun file con nome 'file' trovato nel form-data.", status_code=400)

    except Exception as e:
        logging.error(f"Errore: {e}")
        return func.HttpResponse(f"Errore nel caricamento: {str(e)}", status_code=500)
