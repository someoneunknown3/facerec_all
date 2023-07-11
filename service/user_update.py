from .response import validation_response
from bson.json_util import dumps, ObjectId
import json
from .encrypt_decrypt import *
from .password_verification import password_verification
import base64
from .loadPrivate import *
from .loadPublic import *

def user_update(collection, request):
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

        updated_user = {
            "name": name,
            "password": encrypted_str
        }

        myquery = { "_id": ObjectId(request["id"])}
        newvalues = { "$set": updated_user }
        
        collection.update_one(myquery, newvalues)
        projection = {'password': 0}
        cursor = collection.find(myquery, projection)
        list_cur = list(cursor)
        if list_cur == []:
            raise Exception("Failed Update")
        json_data = json.loads(dumps(list_cur))
        return validation_response("Success Update User", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response("Failed Update User", 400)