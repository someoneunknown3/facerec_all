function emailSent(){
    let form = document.getElementById("forgot")
    form.remove()

    let card_body = document.getElementById("sent")
    let row = document.createElement("div")
    row.classList.add("row", "justify-content-center")
    card_body.appendChild(row)
    
    let col = document.createElement("div")
    col.classList.add("col-8")
    row.appendChild(col)

    let text = document.createElement("div")
    text.classList.add("text-body")
    text.innerHTML = "if the email exist it will be sent"
    col.appendChild(text)    
}

async function handleSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
  
      let [error_msg, newDict] = form_login_error(data)

      const json = JSON.stringify(data);
      const url = "/forgot-route"
  
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
            emailSent()
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
  let form = document.getElementById("forgot");
  form.addEventListener('submit', handleSubmit);
  form.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  });
  
  
  