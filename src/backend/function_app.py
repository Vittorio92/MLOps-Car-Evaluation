import azure.functions as func



app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)



from functions import preprocessing
from functions import training

from functions import prediction
from functions import upload_dataset
from functions import get_metadata

from functions import add_prediction
from functions import add_user
from functions import get_user_predictions
from functions import delete_prediction

from functions import is_model