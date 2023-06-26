def validation_response(message, code, **kwargs):
    data = kwargs.get('data', None)
    response = {
        "message": message,
        "code": code,
    }
    if data is not None:
        response["data"] = data
    return response, code