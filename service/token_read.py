from .token_encode_decode import *
from .response import validation_response
from datetime import datetime

def getToken(token):

    if token[:5] != "TEST ":
        raise Exception("no TEST")
    try:
        json_data = decode(token[5:])
        json_data["exp"] = json_data["exp"] * 1000
        return validation_response("Success Get Expiration Token", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response("Failed Get Expiration Token", 401)