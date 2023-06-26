import face_recognition
from .response import validation_response

# You can change this to any folder on your system
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def compare(file1, file2):
    # Load the uploaded image file
    try:
        if file1.filename == '' or file2.filename == '' or not ((file1 and allowed_file(file1.filename)) and (file2 and allowed_file(file2.filename))):
                raise Exception("file is not allowed")
        img1 = face_recognition.load_image_file(file1)
        img2 = face_recognition.load_image_file(file2)
        face_encodings1 = face_recognition.face_encodings(img1)
        face_encodings2 = face_recognition.face_encodings(img2)
        if len(face_encodings1) > 0 and len(face_encodings2) > 0:
            location2 = face_recognition.face_locations(img2)
            landmark2 = face_recognition.face_landmarks(img2, location2)
            similarities = face_recognition.face_distance(face_encodings1, face_encodings2[0])
            json_data = {
                            "message": "Face verify success",
                            "status_code": "200",
                            "similarity": "%f%%" % (100 * (1 - similarities[0])),
                            "subject_id": "",
                            "session_id": "",
                            "timestamp": 0,
                            "bounding_box": location2[0],
                            "face_landmark": landmark2[0],
                            "rotation": 0,
                            "image_quality": {
                                "blur_score": "0",
                                "blur": False,
                                "dark_score": "0",
                                "dark": False,
                                "grayscale": False
                            },
                            "attributes": {
                                "sunglasses_on": False,
                                "mask_on": False,
                                "veil_on": False
                            }
                        }
            return validation_response("Face compare Success", 200, data=json_data)
        raise Exception("no face")
    except Exception as e:
        print(e)
        json_data = {
                        "message": "Face verification failed",
                        "status_code": "400",
                        "subject_id": "",
                        "session_id": "",
                        "timestamp": 0,
                    }
        return validation_response("Face compare failed", 400, data=json_data)
