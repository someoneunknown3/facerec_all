from bson.json_util import dumps, loads
import json
from .encrypt_decrypt import *
import datetime

def tokenFailed(json_data):
    return json_data is None or json_data["forgot_password_exp"] < datetime.datetime.utcnow()

def tokenVerify(collection, token):
    if(token == None):
        return False
    projection = {'password': 0}
    myquery = {"forgot_password": token}
    document = collection.find_one(myquery, projection)
    json_data = loads(dumps(document))
    if tokenFailed(json_data):
        updated_user = {
            "forgot_password": None,
            "forgot_password_exp": None
        }

        newvalues = { "$set": updated_user }
        collection.update_one(myquery, newvalues)
        return False
    
    return True
