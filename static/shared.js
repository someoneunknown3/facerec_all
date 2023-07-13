async function verify(){
    let myValue = sessionStorage.getItem('token');
    let user_id = null
    if(myValue != undefined){
      try {
        let url = "/verify"
        await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'TEST ' + myValue
            }
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
          user_id = jsonData["data"]
        })
        .catch(function(err) {
          console.info(err + " url: " + url)
          window.location.href = '/login';
        });
        
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
    return user_id
}

async function getUser(){
    user_id = await verify()
    let user = null;
    if(user_id == null){
      window.location.href = '/login';
    }
    if(user_id != null){
      try {
        let url = "/get-user/id"
        url += '?' + new URLSearchParams(user_id).toString();
        await fetch(url, {
          method: "GET",
          redirect: 'follow',
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
          user = jsonData["data"]
          user["_id"] = user["_id"]["$oid"]
        })
        .catch(function(err) {
          console.info(err + " url: " + url)
          window.location.href = '/login';
        });
        
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
    return user
}

function create_error(messages){
  let error = document.getElementById("error")
  if (error != null){
    error.remove()
  }
  let div = document.createElement("div")
  div.classList.add("alert", "alert-danger", "alert-dismissible", "error-module")
  div.id = "error"

  let button = document.createElement("button")
  button.classList.add("error-button", "close")
  button.innerHTML = "x"
  button.addEventListener("click", function(event){
    div.remove()
  })

  let h5 = document.createElement("h5")
  let i = document.createElement("i")
  i.classList.add("icon", "fas", "fa-ban")
  h5.appendChild(i)
  h5.innerHTML += "Alert"

  div.appendChild(h5)
  div.appendChild(button) 
  for(msg of messages){
    let text = document.createElement("div");
    text.innerHTML += "• " + msg
    div.appendChild(text);
  }

  let body = document.body
  // let wrapper = document.getElementById("wrapper")
  body.appendChild(div)
}
