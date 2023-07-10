feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.getElementById("output");
const screenshotForm = document.getElementById("form_output");
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;
const button_helper = document.querySelectorAll('.btn-group button');
let method = 1;
let camera_choice = document.getElementById("choose_camera")
let photo_choice = document.getElementById("choose_photo")
let photo_exist = false;
let photo_src = null;
let camera_src = null;
let camera_exist = false;

let sendURL = null;

let activeStream = null;

const [photo, camera] = button_helper;
const [play, pause, screenshot] = buttons;

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};

const loadFile = function(event, output) {
    const image = document.getElementById(output);
    screenshotForm.classList.remove("d-none")
    photo_exist = true;
    image.src = URL.createObjectURL(event.target.files[0]);
    photo_src = image.src
};

async function detect_success(){
    try {
          let user_id = "guest"
          let user = await verify()
            if (user != null){
              user_id = user["id"]
            }
          let jsonData = {
              "action": "detect",
              "user_id": user_id
          }
          let json = JSON.stringify(jsonData);
          const url = "/log-create"
          fetch(url, {
              method: "POST",
              body: json,
              headers: {
                'Content-Type': 'application/json'
              },
          })
        .then(response =>{
          if (response.ok) {
            return response.json()
          } else {
            console.error('Error:', response.status);
            console.error(response.json())
          }
        })
        .then(jsonData =>{
          
        })
        .catch(function(err) {
          console.info(err + " url: " + url)
        });
        
      } catch (error) {
        console.error('An error occurred:', error);
      }
  }
  
  function handleSubmit(event) {
      event.preventDefault();
      try {
          var canvas = document.createElement('canvas');
          canvas.width = screenshotImage.naturalWidth;
          canvas.height = screenshotImage.naturalHeight;
        
          // Draw the image onto the canvas
          var ctx = canvas.getContext('2d');
          ctx.drawImage(screenshotImage, 0, 0);
          
          // Get the data URL of the image
          let url_src = canvas.toDataURL('image/png');
          
          let jsonData = {
              "url_src": url_src 
          }
          const json = JSON.stringify(jsonData);
          const url = "/detect-route"
          fetch(url, {
              method: "POST",
              body: json,
              headers: {
                'Content-Type': 'application/json'
            }
          })
        .then(response =>{
          if (response.ok) {
            detect_success()
            return response.json()
          } else {
            console.error('Error:', response.status);
            console.error(response.json())
          }
        })
        .then(jsonData =>{
          let data = jsonData["data"]
          let imgURLs = data["dataURL"]
          let similarities = data["similarities"]
          let names = data["names"]
          let result_image = document.getElementById("images")
          result_image.innerHTML = ''
          for(let elem in imgURLs){
            let row_name = document.createElement("div")
            row_name.classList.add("row")
            let label1 = document.createElement("label")
            label1.innerHTML = "Name : " + names[elem]
            row_name.appendChild(label1)
            let row_similarities = document.createElement("div")
            row_similarities.classList.add("row")
            let label2 = document.createElement("label")
            label2.innerHTML = "Similarities : " + similarities[elem]
            row_similarities.appendChild(label2)
            let row_image = document.createElement("div")
            row_image.classList.add("row")
            let image_tag = document.createElement("img")
            image_tag.src = imgURLs[elem]
            image_tag.classList.add("image_helper")
            row_image.appendChild(image_tag)
            result_image.appendChild(row_name)
            result_image.appendChild(row_similarities)
            result_image.appendChild(row_image)
          }
        })
        .catch(function(err) {
          console.info(err + " url: " + url)
        });
        
      } catch (error) {
        console.error('An error occurred:', error);
      }
  }
    
  const submit = document.getElementById("upload")    
  submit.addEventListener('click', handleSubmit);

cameraOptions.onchange = () => {
  const updatedConstraints = {
    ...constraints,
    deviceId: {
      exact: cameraOptions.value
    }
  };

  startStream(updatedConstraints);
};

photo.onclick = () => {
    stopStream();
    if(!method){
        method = 1
        photo.classList.add("btn-success")
        photo.classList.remove("btn-outline-success")
        photo_choice.classList.remove("d-none")
        camera.classList.remove("btn-success")
        camera.classList.add("btn-outline-success")
        camera_choice.classList.add("d-none")
        screenshotForm.classList.add('d-none');
        if(photo_exist){
            screenshotForm.classList.remove('d-none')
            screenshotImage.src = photo_src
        }
    }
}

camera.onclick = () => {
    if(method){
        method = 0
        camera.classList.add("btn-success")
        camera.classList.remove("btn-outline-success")
        camera_choice.classList.remove("d-none")
        photo.classList.remove("btn-success")
        photo.classList.add("btn-outline-success")
        photo_choice.classList.add("d-none")
        screenshotForm.classList.add('d-none');
        if(camera_exist){
            screenshotForm.classList.remove('d-none')
            screenshotImage.src = camera_src
        }
    }
}

play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value
      }
    };
    startStream(updatedConstraints);
  }
};

const pauseStream = () => {
  video.pause();
  play.classList.remove('d-none');
  pause.classList.add('d-none');
};

const doScreenshot = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0);
  screenshotImage.src = canvas.toDataURL('image/webp');
  screenshotForm.classList.remove('d-none');
  camera_src = screenshotImage.src;
  upload.classList.remove('d-none');
  camera_exist = true;
};


pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;

const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  activeStream = stream;
  handleStream(stream);
};


const handleStream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  screenshot.classList.remove('d-none');

};

const resetStream = () => {
    video.srcObject = null;
    play.classList.remove('d-none');
    pause.classList.add('d-none');
    screenshot.classList.add('d-none');
  };

const stopStream = () => {
    if (activeStream) {
      const tracks = activeStream.getTracks();
      tracks.forEach(track => track.stop());
      activeStream = null;
      resetStream(); 
    }
  };  

const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join('');
};

getCameraSelection();