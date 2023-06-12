import face_recognition

# You can change this to any folder on your system
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload(file1):
    # Load the uploaded image file
    if file1.filename == '' or not (file1 and allowed_file(file1.filename)):
            return {
        "face_enroll": [
                {
                    "message": "Face verification failed",
                    "status_code": "400",
                    "subject_id": "",
                    "session_id": "",
                    "timestamp": 0,
                }
            ]
        }, 400
    img1 = face_recognition.load_image_file(file1)
    location1 = face_recognition.face_locations(img1)
    landmark1 = face_recognition.face_landmarks(img1, location1)
    return {
                "face_enroll": [
                {
                    "message": "Face enroll success",
                    "status_code": "200",
                    "subject_id": "",
                    "session_id": "",
                    "timestamp": 0,
                    "bounding_box": location1[0],
                    "face_landmark": landmark1[0],
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
            ]
        }
