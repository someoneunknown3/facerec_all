from .token_encode_decode import *
from .response import validation_response
from .token_create import createToken

def refresh_token(token, request):
    time = request["time"]
    if token[:5] != "TEST ":
        raise Exception("no TEST")
    try:
        json_data = decode(token[5:])
        data = createToken(json_data["id"], time)
        return validation_response("Success Verify User", 200, data=data)
    except Exception as e:
        print(e)
        return validation_response("Failed Verify User", 401)