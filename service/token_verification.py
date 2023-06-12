from .token_encode_decode import *

def verification(token):

    if token[:5] != "TEST ":
        raise Exception("no TEST")
    try:
        payload = decode(token[5:])
        print(payload)
        return {
            "test": [
                    {
                        "message": "Success",
                        "status_code": "200",
                        "id": payload["id"],
                        "timestamp": 0,
                    }
                ]
        }
    except Exception as e:
        print(e)
        return {
            "test": [
                {
                    "message": "Failed",
                    "status_code": "401",
                    "timestamp": 0,
                }
            ]
    }, 401