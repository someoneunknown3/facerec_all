from .response import validation_response
from bson.json_util import dumps, ObjectId
import json

def log_create(collection, request):
    try:
        new_log= {
            "action": request["action"],
            "user_id": request["user_id"]
        }
        cursor = collection.insert_one(new_log)
        inserted_id = cursor.inserted_id

        # Retrieve the inserted document
        myquery = { "_id": ObjectId(inserted_id)}
        inserted_document = collection.find_one(myquery)
        json_data = json.loads(dumps(inserted_document))
        print(json_data)
        return validation_response("Success Create User", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response("Failed Create User", 400)