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
  console.log("messages: " + messages)
  for(msg of messages){
    let text = document.createElement("div");
    text.innerHTML += "• " + msg
    div.appendChild(text);
  }

  let body = document.body
  // let wrapper = document.getElementById("wrapper")
  body.appendChild(div)
}

function form_register_error(form){
  let error = []
  let newDict = {...form};

  for(elem in form){
    if(form[elem] == ""){
      error.push(elem.charAt(0).toUpperCase() + elem.slice(1) + " is empty")
      newDict[elem] = false
    }
    else{
      newDict[elem] = true
    }
  }

  if (form["password"] != "" && !passwordVerification(form["password"])){
    newDict["password"] = false
    newDict["retype"] = false
    error.push("Password needs capital letters, number, and atleast 8 in length")
  }
  else if (form["password"] != form["retype"]){
    newDict["retype"] = false
    error.push("Retype needs to be the same as password")
  }

  return [error, newDict]
}

function form_login_error(form){
  let error = []
  let newDict = {...form};
  for(elem in form){
    if(form[elem] == ""){
      error.push(elem.charAt(0).toUpperCase() + elem.slice(1) + " is empty")
      newDict[elem] = false
    }
    else{
      newDict[elem] = true
    }
  }
  return [error, newDict]
}

function form_color(form){
  for(elem in form){
    if(form[elem]){
      greenBox(elem)
    }
    else{
      redBox(elem)
    }
  }
}

function redBox(str){
  let tags = document.getElementsByName(str);
  tags[0].style.border = "1px solid red";
  tags[0].style.borderRight = "0";
  tags[1].style.border = "1px solid red";
  tags[1].style.borderLeft = "0";
  tags[2].className = "";
  tags[2].classList.add("fas", "fa-exclamation-circle")
  tags[2].style.color = "red"
}

function greenBox(str){
  let tags = document.getElementsByName(str);
  console.log(tags[0])
  tags[0].style.border = "1px solid green";
  tags[0].style.borderRight = "0";
  tags[1].style.border = "1px solid green";
  tags[1].style.borderLeft = "0";
  tags[2].className = "";
  tags[2].classList.add("fas", "fa-check")
  tags[2].style.color = "green"
}

function hasNumbers(inputString) {
  return /\d/.test(inputString);
}

function hasUpper(inputString) {
  return /[A-Z]/.test(inputString);
}

function lengthValid(inputString) {
  return inputString.length >= 8;
}

function passwordVerification(password) {
  return lengthValid(password) && hasNumbers(password) && hasUpper(password);
}
