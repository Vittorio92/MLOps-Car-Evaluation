import os
import os.path as osp

MODEL_CONTAINER = "model"
RAW_DATA_CONTAINER = "raw"
CLEAN_DATA_CONTAINER = "clean"
NAME_PROCESSED_DATASET = "car_eval_processed.csv"
MODEL_NAME = "car_eval_trained_model.joblib"
PREPROCESSOR_NAME = "preprocessor.joblib"
DATASET_NAME = "car.data"

PAGE_SIZE = 6

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", ""),
    "user": os.environ.get("DB_USER", ""),
    "password": os.environ.get("DB_PASSWORD", ""),
    "database": os.environ.get("DB_NAME", "")
}
