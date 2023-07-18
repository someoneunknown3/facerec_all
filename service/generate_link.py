import hashlib
import os
from urllib.parse import urlencode

def generate_token(user_email):
    # Generate a unique token using the user's email and a random salt
    salt = os.urandom(16)
    token = hashlib.sha256(user_email.encode() + salt).hexdigest()

    return token

def generate_link(token, base_url):
    query_params = urlencode({"token": token})
    password_reset_url = f"{base_url}/reset-password?{query_params}"

    return password_reset_url