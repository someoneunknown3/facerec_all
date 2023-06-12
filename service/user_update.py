from .response import validation_response
from bson.json_util import dumps, ObjectId
import json
from .encrypt_decrypt import *
from .password_verification import password_verification
import base64

def user_update(collection, request):
    try:
        name = request["name"]

        #load Keys
        publicKey, privateKey = loadKeys()
        
        #from string to byte
        decodable = base64.b64decode(request["password"])

        #decrypt
        decrypted = decrypt(decodable, privateKey)

        #password verification
        if not password_verification(decrypted):
            raise Exception("Password not valid")
        
        #encrypt
        encrypted = encrypt(decrypted, publicKey)

        #from byte to string
        encrypted_str = base64.b64encode(encrypted).decode('utf-8')

        myquery = { "_id": ObjectId(request["id"])}
        newvalues = { "$set": { "name": name, "password": encrypted_str } }
        
        collection.update_one(myquery, newvalues)

        cursor = collection.find(myquery)
        list_cur = list(cursor)
        json_data = json.loads(dumps(list_cur))
        return validation_response(True, "Success Update User", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response(False, "Failed Update User", 400)