var loadFile = function(event, output) {
              var image = document.getElementById(output);
              image.src=URL.createObjectURL(event.target.files[0]);
};

async function compare_success(){
  try {
      let user_id = "guest"
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
        if (response.ok) {
          compare_success()
          return response.json()
        } else {
          // Handle unsuccessful response
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
      // Handle the error appropriately (e.g., show an error message to the user)
    }
}
const submit = document.getElementById("compare")    
submit.addEventListener('click', handleSubmit);