from flask import Flask, render_template, Response, jsonify, request, redirect

from service.facerec_webcam import *
from service.facerec_upload import *
from service.facerec_compare import *
from service.user_create import *
from service.user_read_all import *
from service.user_read_name import *
from service.user_read_id import *
from service.user_update import *
from service.user_delete import *
from service.login import *
from service.token_verification import *
from pymongo import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)
app.json.sort_keys = False

uri = "mongodb+srv://elliotnathanpradjonggo1:test@cluster0.iluc3nm.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(uri, server_api=ServerApi('1'))

db = client['db_test']
collection = db['user']
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/verify')
def verify():
    headers = request.headers
    return verification(headers.get('Authorization'))

@app.route('/login', methods=['GET'])
def login_route():
    return login(collection, request.json)

@app.route('/user/add', methods=['POST'])
def user_add():
    return user_create(collection, request.json)

@app.route('/user/get-all', methods=['GET'])
def user_get_all():
    return user_read_all(collection)

@app.route('/user/get-name', methods=['GET'])
def user_get_by_name():
    return user_read_name(collection, request.json)

@app.route('/user/get-id', methods=['GET'])
def user_get_by_id():
    return user_read_id(collection, request.json)

@app.route('/user/update', methods=['PUT'])
def user_update_route():
    return user_update(collection, request.json)

@app.route('/user/delete', methods=['DELETE'])
def user_delete_route():
    return user_delete(collection, request.json)


@app.route('/video_feed')
def video_feed():
    #Video streaming route. Put this in the src attribute of an img tag
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/video')
def facerec_webcam():
    return render_template('facerec_webcam.html')

@app.route('/enroll', methods=['GET', 'POST'])
def enroll():
    # Check if a valid image file was uploaded
    if request.method == 'POST':
        if 'file1' not in request.files:
            return redirect(request.url)

        file1 = request.files['file1']
        return jsonify(upload(file1))

    # If no valid image file was uploaded, show the file upload form:
    return render_template('facerec_upload.html')

@app.route('/compare', methods=['GET', 'POST'])
def compare_route():
    # Check if a valid image file was uploaded
    if request.method == 'POST':
        if 'file1' not in request.files or 'file2' not in request.files:
            return redirect(request.url)

        file1 = request.files['file1']
        file2 = request.files['file2']
        
        return jsonify(compare(file1, file2))

    # If no valid image file was uploaded, show the file upload form:
    return render_template('facerec_compare.html')

if __name__ == '__main__':
    app.run(debug=True)