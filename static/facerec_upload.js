var loadFile = function(event, output) {
              var image = document.getElementById(output);
              image.src=URL.createObjectURL(event.target.files[0]);
};

function handleSubmit(event) {
    // event.preventDefault();
    try {
        event.preventDefault();
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
          // Redirect to another route after successful fetch
          return response.json()
          // window.location.href = '/';
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
  
const submit = document.getElementById("upload")    
submit.addEventListener('click', handleSubmit);
