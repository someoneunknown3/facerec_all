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
        window.location.href = '/login';
      })
      .catch(function(err) {
        console.info(err + " url: " + url)
      });
      
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

function timeoutFinish(){
  let black = document.getElementById("black")
  let timeout = document.getElementById("timeout")

  black.remove()
  timeout.remove()
}

function timeoutBox(timeout){
  return new Promise((resolve) => {
    let black = document.createElement("div")
    black.classList.add("black")
    black.id = "black"

    let card = document.createElement("div")
    card.classList.add("card")
    card.id = "timeout"

    let card_body = document.createElement("div")
    card_body.classList.add("card-body", "login-card-body", "timeout")
    card.appendChild(card_body)
    
    let p = document.createElement("div")
    p.classList.add("card", "timeout-title")
    card_body.appendChild(p)

    let b = document.createElement("b")
    b.innerHTML = "Inactivity Detected"
    p.appendChild(b)

    let timer_text = document.createElement("div");
    timer_text.classList.add("timeout-timer");
    timer_text.innerHTML = `Time remaining: ${timeout / 1000} seconds`;
    card_body.appendChild(timer_text);

    let row1 = document.createElement("div")
    row1.classList.add("row")
    card_body.appendChild(row1)
    let card_text = document.createElement("div")
    card_text.classList.add("timeout-body")
    card_text.innerHTML = "Are you still there?"
    card_body.appendChild(card_text)

    let row2 = document.createElement("div")
    row2.classList.add("row", "justify-content-center")
    card_body.appendChild(row2)
    
    let col1 = document.createElement("div")
    col1.classList.add("col-6")
    row2.appendChild(col1)
    let yes = document.createElement("button")
    yes.classList.add("btn", "btn-success", "btn-block", "edit-border", "font-timeout-button")
    yes.innerHTML = "Yes"
    col1.appendChild(yes)
    yes.addEventListener("click", () => {
      resolve(true);
      black.remove();
      card.remove();
      clearTimeout(timeoutHandle);
      clearInterval(timerHandle);
    })

    let col3 = document.createElement("div")
    col3.classList.add("col-6")
    row2.appendChild(col3)
    let no = document.createElement("button")
    no.classList.add("btn", "btn-danger", "btn-block", "edit-border", "font-timeout-button")
    no.innerHTML = "No"
    col3.appendChild(no)
    no.addEventListener("click", () => {
      resolve(false);
      black.remove();
      card.remove();
      clearTimeout(timeoutHandle);
      clearInterval(timerHandle);
    })

    let body = document.body
    body.appendChild(black)
    body.appendChild(card)

    let timeRemaining = timeout;
     const timerHandle = setInterval(() => {
       timeRemaining -= 1000;
       timer_text.innerHTML = `Time remaining: ${timeRemaining / 1000} seconds`;
       if (timeRemaining <= 0) {
         clearInterval(timerHandle);
       }
     }, 1000);

    const timeoutHandle = setTimeout(() => {
      resolve(false);
      black.remove();
      card.remove();
    }, timeout);
  })
}

function timeout(time){
    const TIMEOUT_IN_MS =  time * 60 * 1000; //(time * 1 minute)
    let timeoutHandle;

    // Function to handle user activity
    const handleUserActivity = () => {
      // Clear the previous timeout
      clearTimeout(timeoutHandle);
  
      // Set a new timeout to prompt the user after the specified period of inactivity
      timeoutHandle = setTimeout(async () => {
        // Prompt the user to confirm that they are still active
        const isActive = await timeoutBox(30000)
        if (isActive) {
          let time = 10
          refreshToken(time)
        } else {
          handleLogout()   
        }
      }, TIMEOUT_IN_MS);
    };
  
    // Listen for user activity events
    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
  }
  
  async function refreshToken(time){
    let myValue = sessionStorage.getItem('token');
    let json = {
      "time":time
    }
    let jsonData = JSON.stringify(json)
    try {
      let url = "/refresh-token"
      await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'TEST ' + myValue
          },
          body: jsonData,
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
        sessionStorage.setItem('token', jsonData["data"]["token"]);
      })
      .catch(function(err) {
        console.info(err + " url: " + url)
      });
      
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
let time = 10;
timeout(time)