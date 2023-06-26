import rsa

def encrypt(message, public_key):
    return rsa.encrypt(message.encode('ascii'), public_key)

def decrypt(ciphertext, private_key):
    try:
        return rsa.decrypt(ciphertext, private_key).decode('ascii')
    except:
        return False

def sign(message, private_key):
    return rsa.sign(message.encode('ascii'), private_key, 'SHA-1')

def verify(message, signature, public_key):
    try:
        return rsa.verify(message.encode('ascii'), signature, public_key,) == 'SHA-1'
    except:
        return False