def validation_response(bool, message, code, **kwargs):
    if bool:
        data = kwargs.get('data', None)
        if data is None:
           return {
        "message":message,
        "code":code,
    }, code
        return {
        "message":message,
        "code":code,
        "data":data
    }, code
    return {
        "message":message,
        "code":code,
    }, code