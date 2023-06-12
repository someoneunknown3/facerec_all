import rsa
def generateKeys():
    (publicKey, privateKey) = rsa.newkeys(1024)
    with open('facerec_all/service/keys/publicKey.pem', 'wb') as p:
        p.write(publicKey.save_pkcs1('PEM'))
    with open('facerec_all/service/keys/privateKey.pem', 'wb') as p:
        p.write(privateKey.save_pkcs1('PEM'))   

generateKeys()
