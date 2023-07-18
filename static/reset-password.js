async function handleSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      let [error_msg, newDict] = form_register_error(data)
      const publicKey = await load_publicKey();
      data.password = await encryptRSA(publicKey, data.password);
      data.retype = await encryptRSA(publicKey, data.retype);
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      data["token"] = token

      const json = JSON.stringify(data);
      const url = "/reset-route"
      
      await fetch(url, {
        method: "PUT",
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json,
      })
      .then(response =>{
        return response.json()
      })
      .then(jsonData =>{
        if(jsonData["code"] == 200){
          window.location.href = '/login';
        }
        else{
          form_color(newDict)
          if(error_msg.length > 0){
            throw error_msg
          }
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
  let form = document.getElementById("reset");
  form.addEventListener('submit', handleSubmit);
  form.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  });
  
  
  