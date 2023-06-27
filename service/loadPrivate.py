import rsa

def load_privateKeys():
    with open('service/keys/privateKey.pem', 'rb') as p:
        privateKey = rsa.PrivateKey.load_pkcs1(p.read())
    return privateKey

def load_privateKeys2():
    privateKey = open('service/keys/private.pem', 'r').read()
    return privateKey