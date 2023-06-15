import cv2
import face_recognition
import numpy as np
from .anti_spoofing.test import test


  # use 0 for web camera
#  for cctv camera use rtsp://username:password@ip_address:554/user=username_password='password'_channel=channel_number_stream=0.sdp' instead of camera
# for local webcam use cv2.VideoCapture(0)

# Load a sample picture and learn how to recognize it.
# obama_image = face_recognition.load_image_file("service\\faces\obama.jpg")
# obama_face_encoding = face_recognition.face_encodings(obama_image)[0]

# # Load a second sample picture and learn how to recognize it.
# biden_image = face_recognition.load_image_file("service\\faces\\biden.jpg")
# biden_face_encoding = face_recognition.face_encodings(biden_image)[0]

# Create arrays of known face encodings and their names
known_face_encodings = []
known_face_names = []

# Initialize some variables
face_locations = []
# face_encodings = []
face_names = []
process_this_frame = True
# num_frame = 0
face_real = []
def initialize(collection):
    faces = collection.find()
    for face in faces:
            known_face_names.append(face["image_name"])
            encoded_image = face_recognition.load_image_file(face["image_path"])

            known_face_encodings.append(face_recognition.face_encodings(encoded_image)[0])
def get_face(frame):
    global face_locations, process_this_frame, face_real, face_names, known_face_encodings, known_face_names
    # Only process every other frame of video to save time
    if process_this_frame:
        # Resize frame of video to 1/4 size for faster face recognition processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)

        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        
        # Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        face_real = []
        i = 0
        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            # # If a match was found in known_face_encodings, just use the first one.
            # if True in matches:
            #     first_match_index = matches.index(True)
            #     name = known_face_names[first_match_index]

            # Or instead, use the known face with the smallest distance to the new face
            if known_face_encodings != []:
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]
            top, right, bottom, left = face_locations[i]
            height_box = bottom - top
            width_box = right - left
            extra_height = int(height_box * 0.3)
            extra_width = int(width_box * 0.3)
            send_top = top - extra_height
            send_bot = bottom + extra_height
            send_lef = left - extra_width
            send_rig = right + extra_width
            height, width, _ = rgb_small_frame.shape
            if send_top < 0:
                send_top = 0
            if send_bot > height:
                send_bot = height
            if send_lef < 0:
                send_top = 0
            if send_rig > width:
                send_bot = width    
            image = rgb_small_frame[send_top:send_bot, 
                                    send_lef:send_rig, :]
            if len(image.shape) == 3 and image.shape[2] in [1, 3] and isinstance(image, np.ndarray) and image.size > 0:
                face_real.append(test(image))
            face_names.append(name)
            i += 1

    process_this_frame = not process_this_frame

def box(frame):
    # Display the results
    for (top, right, bottom, left), name , (is_real, value)in zip(face_locations, face_names, face_real):
        # Scale back up face locations since the frame we detected in was scaled to 1/4 size
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4
        if face_real != []:
            if is_real:
                real = "Real Face"
            else:
                real = "Fake Face"
        else:
            real = "Unknown"
            value = 0
        # Draw a box around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Draw a label with a name below the face
        cv2.rectangle(frame, (left, top), (right, top + 15), (0, 0, 255), cv2.FILLED)
        cv2.rectangle(frame, (left, bottom - 15), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 0.5, (255, 255, 255), 1)
        cv2.putText(frame,  real + " {:.2f}".format(value), (left + 6, top + 8), font, 0.5, (255, 255, 255), 1)

def gen_frames(collection):  # generate frame by frame from camera
    num_frame = 0
    camera = cv2.VideoCapture(0)
    initialize(collection)
    while True:
        # Capture frame-by-frame
        num_frame +=1   
        success, frame = camera.read()  # read the camera frame
        if not success:
            break
        else:
            if num_frame % 10 == 0:
                get_face(frame)
            box(frame)
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result
    camera.release()
    

 