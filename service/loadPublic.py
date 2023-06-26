import rsa
import json

def load_publicKeys():
    with open('service/keys/publicKey.pem', 'rb') as p:
        publicKey = rsa.PublicKey.load_pkcs1(p.read())
    return publicKey

def load_publicKeys2():
    with open('service/keys/publicKey.pem', 'rb') as p:
        publicKey = rsa.PublicKey.load_pkcs1(p.read())
    return publicKey

def get_publicKey_str():

    # Load the public key
    publicKey = load_publicKeys()
    publicKey_str = publicKey.save_pkcs1().decode('utf-8')
    # Create a JSON object containing the public key
    data = {
        'publicKey': publicKey_str
    }
    return data
    # # Serialize the JSON object to a string
    # json_str = json.dumps(data)
    # return json_str