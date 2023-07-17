from .token_encode_decode import *
import datetime

def createToken(id, time):
    
    payload = {
                "id": id,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=time)
            }
    token = encode(payload)
    data = {
        "token":token
    }
    return data