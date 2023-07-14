from PIL import Image
from io import BytesIO
import face_recognition
import base64
from .response import validation_response
from PIL import Image
import numpy as np
    
def detection(collection, data_url):

    try:
        queries = []
        error_msg = []
        if len(data_url) == 0:
            error_msg.append("Photo is empty")

        if len(error_msg) > 0:
            raise Exception("Photo is empty")
        
        image_data = base64.b64decode(data_url.split(',')[1])
        frame = face_recognition.load_image_file(BytesIO(image_data))
        faces = collection.find()
        faceURL = []
        known_face_names = []
        similarity = []
        face_locations = face_recognition.face_locations(frame)
        if len(face_locations) <= 0:
            error_msg.append("Face not found")

        if len(error_msg) > 0:
            raise Exception("Face not found")

        if len(face_locations) > 1:
            error_msg.append("Can only submit one face at a time")

        if len(error_msg) > 0:
           raise Exception("Can only submit one face at a time")
        
        face_encodings = face_recognition.face_encodings(frame, face_locations)
        for face in faces:
                image_encoding = np.array(face["face_encoding"])
                similarities = face_recognition.face_distance(face_encodings, image_encoding)
                similar = 1 - similarities[0]
                if similar > 0.6:
                    known_face_names.append(face["image_name"])
                    similarity.append("%f%%" % (100 * (similar)))
                    image = Image.open(face["image_path"])
                    buffer = BytesIO()
                    image.save(buffer, format='PNG')
                    image_data = buffer.getvalue()
                    image_data = base64.b64encode(image_data).decode('utf-8')
                    data_url = f'data:image/png;base64,{image_data}'
                    faceURL.append(data_url)

        if len(known_face_names) <= 0:
            error_msg.append("No face matches")

        if len(error_msg) > 0:
            raise Exception("No face matches")
        
        json_data = {
                        "names": known_face_names,
                        "dataURL":faceURL,
                        "similarities": similarity
                    }
        return validation_response("Face detection Success", 200, data=json_data)
    except Exception as e:
        print(e)
        json_data = {
            "error": queries,
            "error_msg":error_msg
        }
        return validation_response("Face detection failed", 400, data=json_data)


 