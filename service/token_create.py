from .token_encode_decode import *
import datetime

def createToken(id):
    payload = {
                "id": id,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }
    token = encode(payload)
    data = {
        "token":token
    }
    return data