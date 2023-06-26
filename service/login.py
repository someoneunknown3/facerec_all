from .token_encode_decode import *
import datetime
from .response import validation_response
from .encrypt_decrypt import *
from .loadPrivate import *
import base64

def login(collection, request):
    
    try:
        #load keys
        private_key = load_privateKeys()
        
        #from string to byte
        decodable1 = base64.b64decode(request["password"])

        #decrypt input 
        password_input = decrypt(decodable1, private_key)
        print(password_input)
        #find the user
        query = {"name": request["name"]}
        cursor = collection.find(query)
        list_cur = list(cursor)
        if len(list_cur) <= 0:
            raise Exception("user not found")
        user = list_cur[0]

        #from string to byte
        decodable2 = base64.b64decode(request["password"])

        #decrypt db 
        password_db = decrypt(decodable2, private_key)
        
        if password_input != password_db:
            raise Exception("Password wrong")

        payload = {
            "id": str(user["_id"]),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }
        token = encode(payload)
        data = {
            "token":token
        }
        return validation_response("Login Success", 200, data=data)
    except Exception as e:
        print(e)
        return validation_response("Login Failed", 400)