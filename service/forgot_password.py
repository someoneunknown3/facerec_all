import datetime
from .token_encode_decode import *
from .response import validation_response
from .generate_link import generate_token, generate_link
from .send_email import sendEmail

def forgotPassword(collection, request):
    try:
        email = request["email"]
        myquery = { "email": email}
        projection = {"password": 0}
        document = collection.find_one(myquery, projection)
        if len(email) == 0:
            raise Exception("no password")
        if document is None:
            return validation_response("Success Send Email", 200)
    
        subject = "Face Rec | Forgot Password"
        body = "Click the link below to reset your password"
        base_url = "http://127.0.0.1:5000"
        token = generate_token(email)
        updated_user = {
            "forgot_password": token,
            "forgot_password_exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }

        newvalues = { "$set": updated_user }
        
        collection.update_one(myquery, newvalues)

        link = generate_link(token, base_url)
        sendEmail(email, subject, body, link)

        return validation_response("Success Send Email", 200)
    except Exception as e:
        print(e)
        return validation_response("Failed Send Email", 400)