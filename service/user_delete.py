from .response import validation_response
from bson.json_util import ObjectId
import json

def user_delete(collection, request):
    try:
        myquery = { "_id": ObjectId(request["id"])}

        cursor = collection.find(myquery)
        list_cur = list(cursor)
        if list_cur == []:
            raise Exception("User does not exist")
        collection.delete_one(myquery)
        
        return validation_response(True, "Success Delete User", 200)
    except Exception as e:
        print(e)
        return validation_response(False, "Failed Delete User", 400)