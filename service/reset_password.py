from .response import validation_response
from bson.json_util import dumps
import json
from .encrypt_decrypt import *
from .password_verification import password_verification
from .forgot_link_verification import tokenVerify
import base64
from .loadPrivate import *
from .loadPublic import *

def resetPassword(collection, request, token):
    try:        
        queries = []
        error_msg = []
        
        if tokenVerify(collection, token) == False:
            error_msg.append("Token not working")
        
        if len(error_msg) > 0:
            raise Exception("Token not working")

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
            queries.append("retype")
            error_msg.append("Retype has to be the same with the password")

        if len(queries) > 0:
            raise Exception("Retype has to be the same with the password")

        #password verification
        if not password_verification(password):
            queries.append("password")
            error_msg.append("Password not valid")

        if len(queries) > 0:
            raise Exception("Password not valid")
        
        #encrypt
        encrypted = encrypt(password, publicKey)

        #from byte to string
        encrypted_str = base64.b64encode(encrypted).decode('utf-8')

        updated_user = {
            "password": encrypted_str,
            "forgot_password": None,
            "forgot_password_exp": None
        }

        projection = {'password': 0}
        myquery = {"forgot_password": token}
        newvalues = { "$set": updated_user }
        
        collection.update_one(myquery, newvalues)
        projection = {'password': 0}

        updated_document = collection.find_one(myquery, projection)
        json_data = json.loads(dumps(updated_document))
        return validation_response("Success Update User", 200, data=json_data)
    except Exception as e:
        print(e)
        json_data = {
            "error": queries,
            "error_msg":error_msg
        }
        return validation_response("Failed Update User", 400, data=json_data)