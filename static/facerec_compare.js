var loadFile = function(event, output) {
              var image = document.getElementById(output);
              image.src=URL.createObjectURL(event.target.files[0]);
};

async function compare_success(){
  try {
      let user_id = ""
      let user = await verify()
        if (user != null){
          user_id = user["id"]
        }
      let jsonData = {
          "action": "compare",
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
        return response.json()
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
        const formData = new FormData();
        const file1Input = document.getElementById("file1");
        const file2Input = document.getElementById("file2");
        const file1 = file1Input.files[0];
        const file2 = file2Input.files[0];
        formData.append('file1', file1);
        formData.append('file2', file2);
        const url = "/compare-route"
        fetch(url, {
            method: "POST",
            body: formData,
            redirect: "follow"
        })
      .then(response =>{
        return response.json()
      })
      .then(jsonData =>{
        jsonElement = document.getElementById("json")
        if(jsonData["code"] == 200){
          compare_success()
          jsonElement.style.color = "white";
          jsonElement.textContent = JSON.stringify(jsonData, undefined, 2);
        }
        else{
          jsonElement.innerHTML = "";
          for(box of jsonData["data"]["error"]){
            newDict[box] = false
          }
          throw(jsonData["data"]["error_msg"])
        }
      })
      .catch(function(err) {
        create_error(err) 
      });
      
    } catch (error) {
      console.error('An error occurred:', error);
      create_error(error)
    }
}
const submit = document.getElementById("compare")    
submit.addEventListener('click', handleSubmit);