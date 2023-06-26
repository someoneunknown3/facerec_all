from .token_encode_decode import *
from .response import validation_response

def verification(token):

    if token[:5] != "TEST ":
        raise Exception("no TEST")
    try:
        payload = decode(token[5:])
        json_data = {
            "id": payload["id"],
        }
        return validation_response("Success Verify User", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response("Failed Verify User", 401)