import jwt
from cryptography.hazmat.primitives import serialization

def encode(payload):
    # encode
    private_key = open('key', 'r').read()
    pri_key = serialization.load_ssh_private_key(private_key.encode(), password=None)

    token = jwt.encode(payload=payload, key=pri_key, algorithm="RS256")

    return token


def decode(token):
    # decode
    public_key = open('key.pub', 'r').read()
    pub_key = serialization.load_ssh_public_key(public_key.encode())
    decoded = jwt.decode(jwt=token, key=pub_key, algorithms=['RS256', ])
    return decoded