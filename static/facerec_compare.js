var loadFile = function(event, output) {
              var image = document.getElementById(output);
              image.src=URL.createObjectURL(event.target.files[0]);
};

function handleSubmit(event) {
    // event.preventDefault();
    try {
        event.preventDefault();
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
          // Redirect to another route after successful fetch
          return response.json()
          // window.location.href = '/';
        } else {
          // Handle unsuccessful response
          console.error('Error:', response.status);
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
      // Handle the error appropriately (e.g., show an error message to the user)
    }
}
  
const submit = document.getElementById("compare")    
submit.addEventListener('click', handleSubmit);