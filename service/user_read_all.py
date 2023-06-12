from .response import validation_response
from bson.json_util import dumps
import json

def user_read_all(collection):
    try:
        cursor = collection.find()
        list_cur = list(cursor)
        json_data = json.loads(dumps(list_cur))
        return validation_response(True, "Success Get All User", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response(False, "Failed Get All User", 400)