from PIL import Image
from io import BytesIO
import face_recognition
import base64
from .response import validation_response
from PIL import Image
import numpy as np
    
def detection(collection, data_url):
    # Load the uploaded image file
    try:
        image_data = base64.b64decode(data_url.split(',')[1])
        frame = face_recognition.load_image_file(BytesIO(image_data))
        faces = collection.find()
        faceURL = []
        known_face_names = []
        similarity = []
        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)
        for face in faces:
                # encoded_image = face_recognition.load_image_file(face["image_path"])
                # image_encoding = face_recognition.face_encodings(encoded_image)
                image_encoding = np.array(face["face_encoding"])
                if len(image_encoding) > 0 and len(face_encodings) > 0:
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
        json_data = {
                        "names": known_face_names,
                        "dataURL":faceURL,
                        "similarities": similarity
                    }
        return validation_response("Face detection Success", 200, data=json_data)
    except Exception as e:
        print(e)
        json_data = {
                        "data":"test"
                    }
        return validation_response("Face detection failed", 400, data=json_data)


 