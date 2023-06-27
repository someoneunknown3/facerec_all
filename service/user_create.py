from .response import validation_response
from bson.json_util import dumps, ObjectId
import json
from .encrypt_decrypt import *
from .password_verification import password_verification
from .loadPrivate import *
from .loadPublic import *

import base64

def user_create(collection, request):
    try:
        name = request["name"]
        #load Keys
        privateKey2 = load_privateKeys2()
        publicKey = load_publicKeys()
        
        #from string to byte
        decodable1 = base64.b64decode(request["password"])
        decodable2 = base64.b64decode(request["retype"])

        #decrypt
        rsa_key = RSA.importKey(privateKey2)
        cipher = PKCS1_v1_5.new(rsa_key)
        pass_decrypted = cipher.decrypt(decodable1, "ERROR")
        password = pass_decrypted.decode('utf-8')
        retype_decrypted= cipher.decrypt(decodable2, "ERROR")
        retype = retype_decrypted.decode('utf-8')

        if password != retype:
            raise Exception("Password and Retype not the same")

        #password verification
        if not password_verification(password):
            raise Exception("Password not valid")
        
        #encrypt
        encrypted = encrypt(password, publicKey)

        #from byte to string
        encrypted_str = base64.b64encode(encrypted).decode('utf-8')

        new_user = {
            "name": name,
            "password": encrypted_str
        }
        print("test")
        cursor = collection.insert_one(new_user)
        inserted_id = cursor.inserted_id
        print(cursor)
        print(inserted_id)

        # Retrieve the inserted document
        myquery = { "_id": ObjectId(inserted_id)}
        inserted_document = collection.find_one(myquery)
        json_data = json.loads(dumps(inserted_document))
        print(json_data)
        return validation_response("Success Create User", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response("Failed Create User", 400)