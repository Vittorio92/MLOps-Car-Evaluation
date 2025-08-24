import logging
import json
import math
import azure.functions as func
from shared.db import get_conn
from shared.config import PAGE_SIZE


get_user_predictions = func.Blueprint()


@get_user_predictions.route(route="get_user_predictions", methods=["GET"])
def get_user_predictions(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger. Lista delle predizioni di un utente')
    
    try:
        # Parametri GET
        email = req.params.get("email")
        page = req.params.get("page", "1")
        class_filter = req.params.get("class")

        if not email:
            return func.HttpResponse(
                json.dumps({"error": "Manca il parametro email"}),
                mimetype="application/json",
                status_code=400
            )

        page = int(page)
        if page < 1:
            page = 1

        # Connessione DB
        conn = get_conn()
        cursor = conn.cursor(dictionary=True)

        # Query conteggio
        count_query = "SELECT COUNT(*) as total FROM predictions WHERE user_email = %s"
        params = [email]
        if class_filter:
            count_query += " AND class = %s"
            params.append(class_filter)

        cursor.execute(count_query, tuple(params))
        total_records = cursor.fetchone()["total"]
        total_pages = math.ceil(total_records / PAGE_SIZE) if total_records else 1

        # Query dati
        offset = (page - 1) * PAGE_SIZE
        base_query = "SELECT id, buying, maint, doors, persons, lug_boot, safety, class FROM predictions WHERE user_email = %s"
        if class_filter:
            base_query += " AND class = %s"
        base_query += " LIMIT %s OFFSET %s"

        final_params = tuple(params + [PAGE_SIZE, offset])
        cursor.execute(base_query, final_params)
        results = cursor.fetchall()

        logging.info(f"Fetched {len(results)}")

        cursor.close()
        conn.close()

        return func.HttpResponse(
            body=json.dumps({
                "page": page,
                "total_pages": total_pages,
                "predictions": results
            }),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        logging.error(str(e))
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )
