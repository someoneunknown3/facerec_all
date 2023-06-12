from .response import validation_response
from bson.json_util import dumps, ObjectId
import json

def user_read_id(collection, request):
    try:
        myquery = { "_id": ObjectId(request["id"])}
        
        cursor = collection.find(myquery)
        list_cur = list(cursor)
        json_data = json.loads(dumps(list_cur))
        return validation_response(True, "Success Get User by Id", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response(False, "Failed Get User by Id", 400)