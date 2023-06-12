from .response import validation_response
from bson.json_util import dumps
import json
from .encrypt_decrypt import *
from .password_verification import password_verification
import base64

def user_create(collection, request):
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

        new_user = {
            "name": name,
            "password": encrypted_str
        }
        cursor = collection.insert_one(new_user)
        inserted_id = cursor.inserted_id

        # Retrieve the inserted document
        inserted_document = collection.find_one({"_id": inserted_id})
        json_data = json.loads(dumps(inserted_document))
        
        return validation_response(True, "Success Create User", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response(False, "Failed Create User", 400)