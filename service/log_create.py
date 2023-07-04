from .response import validation_response
from bson.json_util import dumps, ObjectId
import json
import datetime;

def log_create(collection, request):
    try:
        date = datetime.datetime.now()
        date_str = date.strftime('%Y-%m-%d %H:%M:%S')
        new_log= {
            "action": request["action"],
            "user_id": request["user_id"],
            "date": date_str
        }
        cursor = collection.insert_one(new_log)
        inserted_id = cursor.inserted_id

        # Retrieve the inserted document
        myquery = { "_id": ObjectId(inserted_id)}
        inserted_document = collection.find_one(myquery)
        json_data = json.loads(dumps(inserted_document))
        print(json_data)
        return validation_response("Success Create Log", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response("Failed Create Log", 400)