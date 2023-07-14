async function verify(){
    let myValue = sessionStorage.getItem('token');
    console.log(myValue)
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

async function handleLogout(){
  try {
    sessionStorage.removeItem('token');
    token = sessionStorage.getItem('token');

    data = {
      "success": (token == null)
    }
    const json = JSON.stringify(data);
    const url = "logout"
    await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: json,
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

function timeout(){
  const TIMEOUT_IN_MS = 10 * 60 * 1000;
  let timeoutHandle;

  // Function to handle user activity
  const handleUserActivity = () => {
    // Clear the previous timeout
    clearTimeout(timeoutHandle);

    // Set a new timeout to prompt the user after the specified period of inactivity
    timeoutHandle = setTimeout(() => {
      // Prompt the user to confirm that they are still active
      const isActive = confirm('Are you still there?');

      if (isActive) {
        // timeoutBox()
      } else {
          handleLogout()   
      }
    }, TIMEOUT_IN_MS);
  };

  // Listen for user activity events
  document.addEventListener('mousemove', handleUserActivity);
  document.addEventListener('keydown', handleUserActivity);
}


function interval(time=10){
  // Set the interval period in milliseconds
  const INTERVAL_IN_MS = time * 60 * 1000; // 1 minute

  // Function to check the expiration time of the access token
  const checkTokenExpiration = () => {
    // Get the current time
    let myValue = sessionStorage.getItem('token');
    const currentTime = new Date().getTime();

    // Get the expiration time of the access token
    console.log(myValue)
    const expirationTime = test; // retrieve the expiration time from storage

    // Check if the access token is about to expire
    if (currentTime >= expirationTime) {
      // Refresh the access token
      // ...
    }
  };

  // Set an interval to periodically check the expiration time of the access token
  setInterval(checkTokenExpiration, INTERVAL_IN_MS);
}