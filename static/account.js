let username = document.getElementById("username")
let password = document.getElementById("password")
let accounts = [{text:"Username", key:"name"}]
let add = [{text:"Password", key:"password"}, {text:"Retype-Password", key:"retype"}]

async function load_publicKey() {
    let key = await fetch('/public-key');
    let json = await key.json()
    return json["publicKey"]
  }
  
  async function encryptRSA(publicKey, plaintext) {
    return new Promise((resolve, reject) => {
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey);
      let encrypted = encrypt.encrypt(plaintext);
      if (encrypted) {
        resolve(encrypted);
      } else {
        reject(new Error('RSA encryption failed'));
      }
    });
  
  }

async function handleSubmit(user) {
    try {
      const text = document.querySelectorAll('.text2');
      const publicKey = await load_publicKey();
      let jsonData = {
        "id": user["_id"]
      }
      const array = accounts.concat(add);
      for(let i in array){
        jsonData[array[i]["key"]] = text[i].innerHTML
      }
      jsonData["password"] = await encryptRSA(publicKey, jsonData["password"]);
      jsonData["retype"] = await encryptRSA(publicKey, jsonData["retype"]);
      let json = JSON.stringify(jsonData);
      console.log(json)
      const url = "/update-user"
      await fetch(url, {
        method: "PUT",
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json,
      })
      .then(response =>{
        if (response.ok) {
          // Redirect to another route after successful fetch
          return response.json()
        } else {
          // Handle unsuccessful response
          console.error('Error:', response.status);
          console.error(response.json())
        }
      })
      .then(jsonData =>{
        window.location.href = '/account';
      })
      .catch(function(err) {
        console.info(err + " url: " + url)
      });
      
    } catch (error) {
      console.error('An error occurred:', error);
      console.error(response.json())
    }
}

function handleEdit(user){
    const button = document.getElementById("button")
    let account_card = document.getElementById("account-info")
    let row = document.getElementById("row_button")
    row.remove();
    for(let account of add){
        let input_group = document.createElement("div")
        input_group.classList.add("input-group", "mb-3")
        account_card.appendChild(input_group)

        let input_group_append_1 = document.createElement("div")
        input_group_append_1.classList.add("input-group-append", "input-group-append-1")
        input_group.appendChild(input_group_append_1)

        let input_group_text_1 = document.createElement("div")
        input_group_text_1.classList.add("input-group-text", "text1")
        input_group_text_1.innerHTML = account["text"]
        input_group_append_1.appendChild(input_group_text_1)
        
        let input_group_append_2 = document.createElement("div")
        input_group_append_2.classList.add("input-group-append", "input-group-append-2")
        input_group.appendChild(input_group_append_2)

        let input_group_text_2 = document.createElement("div")
        input_group_text_2.classList.add("input-group-text", "text2", "protect")
        input_group_text_2.innerHTML = user[account["key"]]
        input_group_append_2.appendChild(input_group_text_2)
    }
    const text = document.querySelectorAll('.text2');
    account_card.appendChild(row)
    for(let item of text){
        item.contentEditable = "true";
    }
    button.innerHTML = "Submit"
    button.classList.remove("btn-light")
    button.classList.add("btn-success")
    
    button.removeEventListener("click", handleClick);
    button.addEventListener("click", (event) => handleSubmit(user))
}

function handleClick(event) {
    handleEdit(user);
  }
  
let user = null;
async function getUsername(){
    await getUser()
    .then(jsonData =>{
        user = jsonData
    })
    let account_card = document.getElementById("account-info")
    user["password"] = ""
    user["retype"] = ""
    for(let account of accounts){
        let input_group = document.createElement("div")
        input_group.classList.add("input-group", "mb-3")
        account_card.appendChild(input_group)

        let input_group_append_1 = document.createElement("div")
        input_group_append_1.classList.add("input-group-append", "input-group-append-1")
        input_group.appendChild(input_group_append_1)

        let input_group_text_1 = document.createElement("div")
        input_group_text_1.classList.add("input-group-text", "text1")
        input_group_text_1.innerHTML = account["text"]
        input_group_append_1.appendChild(input_group_text_1)
        
        let input_group_append_2 = document.createElement("div")
        input_group_append_2.classList.add("input-group-append", "input-group-append-2")
        input_group.appendChild(input_group_append_2)

        let input_group_text_2 = document.createElement("div")
        input_group_text_2.classList.add("input-group-text", "text2")
        input_group_text_2.innerHTML = user[account["key"]]
        input_group_append_2.appendChild(input_group_text_2)
    }
    let row = document.createElement("div")
    row.classList.add("row")
    row.id = "row_button"
    account_card.appendChild(row)

    let col_8 = document.createElement("div")
    col_8.classList.add("col-8")
    row.appendChild(col_8)

    let col_4 = document.createElement("div")
    col_4.classList.add("col-4")
    row.appendChild(col_4)

    let button = document.createElement("div")
    button.classList.add("btn", "btn-light", "btn-block", "edit-border")
    button.innerHTML = "Edit"
    button.id = "button"
    col_4.appendChild(button)

    button.addEventListener("click", handleClick);
}
getUsername()