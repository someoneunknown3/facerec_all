def has_numbers(inputString):
    return any(char.isdigit() for char in inputString)

def has_upper(inputString):
    return any(char.isupper()for char in inputString)

def length_valid(inputString):
    return len(inputString) >= 8

def password_verification(password):
    return length_valid(password) and has_numbers(password) and has_upper(password)
    