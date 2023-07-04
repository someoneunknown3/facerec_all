var loadFile = function(event, output) {
              var image = document.getElementById(output);
              image.src=URL.createObjectURL(event.target.files[0]);
};

async function upload_success(){
  try {
        let user_id = "guest"
        let user = await verify()
          if (user != null){
            user_id = user["id"]
          }
        let jsonData = {
            "action": "upload",
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
        console.log(jsonData)
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
        let name = document.getElementById("name")
        let json = {
            name: name.value
        }
        const str = JSON.stringify(json);
        const formData = new FormData();
        const fileInput = document.getElementById("file1");
        const file = fileInput.files[0];
        formData.append('file1', file);
        formData.append('name', str);
        const url = "/enroll-route"
        fetch(url, {
            method: "POST",
            body: formData,
            redirect: "follow"
        })
      .then(response =>{
        if (response.ok) {
          upload_success()
          return response.json()
        } else {
          console.error('Error:', response.status);
          console.error(response.json())
        }
      })
      .then(jsonData =>{
        jsonElement = document.getElementById("json")
        jsonElement.style.color = "white";
        jsonElement.textContent = JSON.stringify(jsonData, undefined, 2);
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
