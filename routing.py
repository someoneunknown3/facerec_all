from flask import Flask, render_template, Response, jsonify, request, redirect, send_file, url_for

from service.loadPublic import get_publicKey_str
from service.detect import detection
from service.facerec_webcam import gen_frames
from service.facerec_upload import upload
from service.facerec_compare import compare
from service.user_create import user_create
from service.user_read_all import user_read_all
from service.user_read_name import user_read_name
from service.user_read_id import user_read_id
from service.user_update import user_update
from service.user_delete import user_delete
from service.log_create import log_create
from service.log_read_page import log_read_page
from service.login import login
from service.logout import logout
from service.token_verification import verification
from service.token_refresh import refresh_token
from service.token_read import getToken
from service.forgot_password import forgotPassword
from service.reset_password import resetPassword
from service.forgot_link_verification import tokenVerify
from service.ocr_ktp import ocr_ktp
from pymongo import MongoClient
from pymongo.server_api import ServerApi

from waitress import serve


app = Flask(__name__)
app.json.sort_keys = False
app.config['UPLOAD_FOLDER'] = "faces"
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000
uri = "mongodb+srv://elliotnathanpradjonggo1:test@cluster0.iluc3nm.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(uri, server_api=ServerApi('1'))

db = client['db_test_baru']
user_collect = db['user']
user_collect.create_index('name', unique = True)
user_collect.create_index('email', unique = True)

face_collect = db['faces']

data_collect = db['data']
data_collect.create_index('name', unique = True)

log_collect = db['log']
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/public-key')
def get_public_key():
    public_key = get_publicKey_str()
    return public_key

@app.route('/verify')
def verify():
    headers = request.headers
    return verification(headers.get('Authorization'))

@app.route('/get-token')
def token_get():
    headers = request.headers
    return getToken(headers.get('Authorization'))

@app.route('/refresh-token', methods=['POST'])
def token_refresh():
    headers = request.headers
    return refresh_token(headers.get('Authorization'), request.json)

@app.route('/get-user', methods=['GET'])
def user_get_all():
    return user_read_all(user_collect)

@app.route('/get-user/name', methods=['GET'])
def user_get_by_name():
    return user_read_name(user_collect, request.json)

@app.route('/get-user/id', methods=['GET'])
def user_get_by_id():
    user_id = request.args.get('id')
    jsonData = {
        "id": user_id
    }
    return user_read_id(user_collect, jsonData)

@app.route('/update-user', methods=['PUT'])
def user_update_route():
    return user_update(user_collect, request.json)

@app.route('/delete-user', methods=['DELETE'])
def user_delete_route():
    return user_delete(user_collect, request.json)

@app.route('/video_feed')
def video_feed():
    #Video streaming route. Put this in the src attribute of an img tag
    return Response(gen_frames(face_collect), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video')
def facerec_webcam():
    return render_template('facerec_webcam.html')

@app.route('/logout', methods=['POST'])
def logout_route():
    success = request.json["success"]
    return logout(success)

@app.route('/forgot-password')
def forgot_html():
    return render_template('forgot-password.html')

@app.route('/forgot-route', methods=['PUT'])
def forgot_route():
    if request.method == 'PUT':
        return forgotPassword(user_collect, request.json)

@app.route('/reset-password')
def reset_html():
    token = request.args.get('token')   
    if(tokenVerify(user_collect, token)):
        return render_template('reset-password.html')
    return redirect(url_for('login_html'))

@app.route('/reset-route', methods=['PUT'])
def reset_route():
    if request.method == 'PUT':
        token = request.json["token"]
        return resetPassword(user_collect, request.json, token)

@app.route('/login')
def login_html():
    return render_template('login.html')

@app.route('/login-route', methods=['POST'])
def login_route():
    if request.method == 'POST':
        return login(user_collect, request.json)

@app.route('/enroll')
def enroll():
    return render_template('upload.html')

@app.route('/enroll-route', methods=['POST'])
def enroll_route():
    if request.method == 'POST':
        return upload(app.config['UPLOAD_FOLDER'], face_collect, request.json)

@app.route('/compare')
def compare_func():
    return render_template('compare.html')
    
@app.route('/compare-route', methods=['POST'])
def compare_route():
    if request.method == 'POST':
        return compare(request.files)

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/register-route', methods=['POST'])
def register_route():
    if request.method == 'POST':
        return user_create(user_collect, request.json)
    
@app.route('/detect')
def detect():
    return render_template('detect.html')

@app.route('/detect-route', methods=['POST'])
def detect_route():
    if request.method == 'POST':
        url_src = request.json['photo']
        return detection(face_collect, url_src)

@app.route('/ktp-reader')
def ktp_reader():
    return render_template('ktp-reader.html')

@app.route('/ktp-reader-route', methods=['POST'])
def ktp_reader_route():
    if request.method == 'POST':
        url_src = request.json['photo']
        return ocr_ktp(data_collect, url_src)
    
@app.route('/log')
def log():
    return render_template('log.html')

@app.route('/log-page', methods=['GET'])
def log_get():
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=10, type=int)
    sort_by = request.args.get('sort_by', default='Date', type=str)
    sort = request.args.get('sort', default='DSC', type=str)
    return log_read_page(log_collect, page, limit, sort_by, sort)

@app.route('/log-create', methods=['POST'])
def log_route():
    if request.method == 'POST':
        return log_create(log_collect, user_collect, request.json)
    
@app.route('/account')
def account():
    return render_template('account.html')

if __name__ == '__main__':
    app.run(debug=True)
# if __name__ == '__main__':
#     serve(app, host='127.0.0.1', port=5000)