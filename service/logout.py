from .response import validation_response

def logout(success):
    if success:
        return validation_response("Logout Succeed", 200)
    return validation_response("Logout Failed", 401)