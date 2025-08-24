import logging
import json
import azure.functions as func
from function_app import app
from shared.db import get_conn

@app.route(route="add_prediction", methods=["POST"])
def add_prediction(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger. Aggiunta della predizione al DB')

    try:
        # Lettura dei parametri dal body della richiesta
        req_body = req.get_json()
        user_email = req_body.get('user_email')
        buying = req_body.get('buying')
        maint = req_body.get('maint')
        doors = req_body.get('doors')
        persons = req_body.get('persons')
        lug_boot = req_body.get('lug_boot')
        safety = req_body.get('safety')
        class_val = req_body.get('class')

        # Connessione al db
        conn = get_conn()
        cursor = conn.cursor()

        # Query per inserire la predizione
        sql = """INSERT INTO predictions 
            (user_email, buying, maint, doors, persons, lug_boot, safety, class) 
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"""
        cursor.execute(sql, (user_email, buying, maint, doors, persons, lug_boot, safety, class_val))
        conn.commit()

        cursor.close()
        conn.close()

        logging.info('Predizione inserita con successo')
        return func.HttpResponse("Predizione inserita correttamente", status_code=200)

    except Exception as e:
        logging.error(f"Errore: {str(e)}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
