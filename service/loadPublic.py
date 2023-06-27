import rsa
from Crypto.Cipher import PKCS1_v1_5
from Crypto.PublicKey import RSA

def load_publicKeys():
    with open('service/keys/publicKey.pem', 'rb') as p:
        publicKey = rsa.PublicKey.load_pkcs1(p.read())
    return publicKey

def load_publicKeys2():
    publicKey = open('service/keys/public.pem', 'r').read()
    return publicKey

def get_publicKey_str():

    # Load the public key
    publicKey = load_publicKeys2()
    # publicKey_str = publicKey.save_pkcs1().decode('utf-8')
    # Create a JSON object containing the public key
    data = {
        'publicKey': publicKey
    }
    return data
    # # Serialize the JSON object to a string
    # json_str = json.dumps(data)
    # return json_str