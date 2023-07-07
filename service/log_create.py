from .response import validation_response
from bson.json_util import dumps, ObjectId
import json
import datetime;

def log_create(log_collection, user_collection, request):
    try:
        date = datetime.datetime.now()
        date_str = date.strftime('%Y-%m-%d %H:%M:%S')
        inserted_document = {"name": "guest"}
        projection = {'password': 0, "_id": 0}
        if request["user_id"] != "guest":
            myquery = { "_id": ObjectId(request["user_id"])}
            inserted_document = user_collection.find_one(myquery, projection)
        new_log= {
            "Username": inserted_document["name"],
            "Action": request["action"],
            "Date": date_str
        }
        cursor = log_collection.insert_one(new_log)
        inserted_id = cursor.inserted_id

        myquery = { "_id": ObjectId(inserted_id)}
        inserted_document = log_collection.find_one(myquery)
        json_data = json.loads(dumps(inserted_document))
        return validation_response("Success Create Log", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response("Failed Create Log", 400)