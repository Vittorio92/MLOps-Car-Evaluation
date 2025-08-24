import logging
import json
import azure.functions as func
from function_app import app
from shared.db import get_conn

@app.route(route="delete_prediction", methods=["DELETE"])
def delete_prediction(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger. Eliminazione di una predizione')

    try:
        # Lettura dell'id della predizione
        pred_id = req.params.get("id")

        if not pred_id:
            return func.HttpResponse("ID della predizione non presente", status_code=400)

        # Connessione al DB
        conn = get_conn()
        cursor = conn.cursor()

        # Creazione della query
        delete_query = "DELETE FROM predictions WHERE id = %s"
        params = (pred_id,)

        cursor.execute(delete_query, params)
        conn.commit()

        deleted_rows = cursor.rowcount

        cursor.close()
        conn.close()

        if deleted_rows == 0:
            return func.HttpResponse("Predizione non trovata", status_code=404)

        return func.HttpResponse("Predizione eliminata correttamente", status_code=200)

    except Exception as e:
        logging.error(str(e))
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )
