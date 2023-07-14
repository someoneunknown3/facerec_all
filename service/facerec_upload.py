from bson import ObjectId
from PIL import Image
import face_recognition
import json
from bson.json_util import dumps
from .response import validation_response
import os
import base64
from io import BytesIO

def upload(upload_folder, collection, request):
    try:
        queries = []
        error_msg = []

        if len(request["name"]) <= 0:
            queries.append("name")
            error_msg.append("Name is empty")

        if len(error_msg) > 0:
            raise Exception("Name is empty")

        data_url = request["photo"]

        if len(data_url) == "":
            queries.append("name")
            error_msg.append("Photo is empty")

        if len(error_msg) > 0:
            raise Exception("Photo is empty")
        
        image_data = base64.b64decode(data_url.split(',')[1])
        img1 = face_recognition.load_image_file(BytesIO(image_data))
        image = Image.fromarray(img1)
        location1 = face_recognition.face_locations(img1)
        
        if len(location1) <= 0:
            queries.append("photo")
            error_msg.append("Face not found")

        if len(error_msg) > 0:
            raise Exception("Face not found")
        
        if len(location1) > 1:
            queries.append("photo")
            error_msg.append("Can only submit one face at a time")

        if len(error_msg) > 0:
           raise Exception("Can only submit one face at a time")

        encoding1 = face_recognition.face_encodings(img1)
        landmark1 = face_recognition.face_landmarks(img1, location1)
        id = ObjectId()
        file_path = os.path.join(upload_folder, str(id) + ".png")
        encoding = encoding1[0].tolist()
        new_image = {
            "_id": id,
            "image_name": request['name'],
            "image_path": file_path,
            "face_encoding": encoding,
            "face_location": location1[0],
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
            "error": queries,
            "error_msg":error_msg
        }
        return validation_response("Face enroll failed", 400, data=json_data)
