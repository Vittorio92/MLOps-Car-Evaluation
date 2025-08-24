import logging
import azure.functions as func
from shared.db import get_conn


add_user = func.Blueprint()


@add_user.route(route="add_user", methods=["POST"])
def add_user(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger. Aggiunta utente al DB')

    try:
        # Lettura dei parametri dal body della richiesta
        req_body = req.get_json()
        name = req_body.get('name')
        email = req_body.get('email')

        if not name or not email:
            return func.HttpResponse("Email o nome non presenti nel body", status_code=400)

        # Connessione al DB
        conn = get_conn()
        cursor = conn.cursor()

        # Verifica della presenza dell'utente
        check_sql = "SELECT COUNT(*) FROM users WHERE email = %s"
        cursor.execute(check_sql, (email,))
        result = cursor.fetchone()
        if result[0] > 0:
            cursor.close()
            conn.close()
            return func.HttpResponse("Utente già presente nel database", status_code=200)

        # Query per inserire l'utente
        sql = "INSERT INTO users (email, name) VALUES (%s, %s)"
        cursor.execute(sql, (email, name))
        conn.commit()

        cursor.close()
        conn.close()

        return func.HttpResponse("Utente inserito correttamente", status_code=200)

    except Exception as e:
        logging.error(f"Errore: {str(e)}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
