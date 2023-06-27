from .response import validation_response
from bson.json_util import dumps, ObjectId
import json

def user_read_id(collection, request):
    try:
        myquery = { "_id": ObjectId(request["id"])}
        projection = {'password': 0}

        user = collection.find_one(myquery, projection)
        json_data = json.loads(dumps(user))
        return validation_response("Success Get User by Id", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response("Failed Get User by Id", 400)