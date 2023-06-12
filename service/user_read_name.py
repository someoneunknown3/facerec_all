from .response import validation_response
from bson.json_util import dumps
import json

def user_read_name(collection, request):
    try:
        query = {"name": request["name"]}
        cursor = collection.find(query)
        list_cur = list(cursor)
        json_data = json.loads(dumps(list_cur))
        return validation_response(True, "Success Get User by Name", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response(False, "Failed Get User by Name", 400)