import azure.functions as func

from functions.preprocessing import preprocessfunction
from functions.training import trainingfunction

from functions.prediction import prediction
from functions.upload_dataset import upload_dataset
from functions.get_metadata import get_metadata

from functions.add_prediction import add_prediction
from functions.add_user import add_user
from functions.get_user_predictions import get_user_predictions
from functions.delete_prediction import delete_prediction

from functions.is_model import isModel


app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


app.register_functions(preprocessfunction)
app.register_functions(trainingfunction)
app.register_functions(prediction)
app.register_functions(upload_dataset)
app.register_functions(get_metadata)
app.register_functions(add_prediction)
app.register_functions(add_user)
app.register_functions(get_user_predictions)
app.register_functions(delete_prediction)
app.register_functions(isModel)