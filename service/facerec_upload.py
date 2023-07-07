from bson import ObjectId
from PIL import Image
import face_recognition
import json
from bson.json_util import dumps
from .response import validation_response
import os



# You can change this to any folder on your system
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload(upload_folder, file1, collection, request):
    # Load the uploaded image file
    try:
        if file1.filename == '' or not (file1 and allowed_file(file1.filename)):
            raise Exception("Failed face enroll")
        if len(request["name"]) <= 0:
            raise Exception("Name is empty")
        image = Image.open(file1)
        img1 = face_recognition.load_image_file(file1)
        location1 = face_recognition.face_locations(img1)
        if len(location1) <= 0:
            raise Exception("Face not found")
        if len(location1) > 1:
            raise Exception("Can only submit one face at a time")
        landmark1 = face_recognition.face_landmarks(img1, location1)
        id = ObjectId()
        split_tup = os.path.splitext(file1.filename)
        file_path = os.path.join(upload_folder, str(id) + split_tup[1])
        new_image = {
            "_id": id,
            "image_name": request['name'],
            "image_path": file_path,
            "face_encoding": location1[0],
            "face_landmark": landmark1[0]
        }
        cursor = collection.insert_one(new_image)
        inserted_id = cursor.inserted_id

        # Retrieve the inserted document
        inserted_document = collection.find_one({"_id": inserted_id})
        json_str = json.loads(dumps(inserted_document))
        image.save(file_path)
        json_data = {
                        "subject_id": "",
                        "session_id": "",
                        "timestamp": 0,
                        "image":json_str,
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
        return validation_response("Face enroll Success", 200, data=json_data)
    except Exception as e:
        print(e)
        json_data = {
                        "subject_id": "",
                        "session_id": "",
                        "timestamp": 0,
        }
        return validation_response("Face enroll failed", 400, data=json_data)
