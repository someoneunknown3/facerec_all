let username = document.getElementById("username")
let password = document.getElementById("password")
let accounts = [{text:"Username", key:"name", symbol:"fa-envelope"}]
let add = [{text:"Password", key:"password", symbol:"fa-lock"}, {text:"Retype-Password", key:"retype", symbol:"fa-lock"}]

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
function handleEdit(){
  let account_card = document.getElementById("update")
  let row = document.getElementById("row_button")
  row.remove();
  for(let account of add){
      let input_group = document.createElement("div")
      input_group.classList.add("input-group", "mb-3")
      account_card.appendChild(input_group)
      input_group.id = "password"

      let input_group_append_1 = document.createElement("div")
      input_group_append_1.classList.add("input-group-append", "input-group-append-1")
      input_group.appendChild(input_group_append_1)

      let input_group_text_1 = document.createElement("div")
      input_group_text_1.classList.add("input-group-text", "text1")
      input_group_text_1.innerHTML = account["text"]
      input_group_append_1.appendChild(input_group_text_1)
      
      let input_group_append_2 = document.createElement("input")
      input_group_append_2.classList.add("form-control", "form-helper")
      input_group_append_2.value = user[account["key"]]
      input_group_append_2.setAttribute('name', account["key"]);
      input_group_append_2.type = "password"
      input_group.appendChild(input_group_append_2)

      let input_group_append_3 = document.createElement("div")
      input_group_append_3.classList.add("input-group-append")
      input_group.appendChild(input_group_append_3)

      let input_group_text_3 = document.createElement("div")
      input_group_text_3.classList.add("input-group-text", "text-symbol")
      input_group_text_3.setAttribute('name', account["key"]);
      input_group_append_3.appendChild(input_group_text_3)

      let symbol = document.createElement("span")
      symbol.classList.add("fas", account["symbol"])
      symbol.setAttribute('name', account["key"]);
      input_group_text_3.appendChild(symbol)
  }
  const text = document.querySelectorAll('.form-control');
  account_card.appendChild(row)
  for(let item of text){
     item.disabled = false
  }
  const button = document.getElementById("button")
  button.innerHTML = ""
  submitButton(button)

  const cancel = document.getElementById("cancel")
  cancelButton(cancel)
}

function editButton(col){
  let button = document.createElement("div")
  button.classList.add("btn", "btn-light", "btn-block", "edit-border")
  button.innerHTML = "Edit"
  button.id = "edit"
  col.appendChild(button)

  button.addEventListener("click", handleEdit);
}
  
async function handleSubmit(event) {
  event.preventDefault();

  try {
    let form = document.getElementById("update");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    let [error_msg, newDict] = form_register_error(data)

    const publicKey = await load_publicKey();
    data.id = user["_id"]
    data.password = await encryptRSA(publicKey, data.password);
    data.retype = await encryptRSA(publicKey, data.retype);
    let json = JSON.stringify(data);
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
      return response.json()
    })
    .then(jsonData =>{
      console.log(jsonData)
      if(jsonData["code"] == 200){
        window.location.href = '/account';
      }
      else{
        for(box of jsonData["data"]["error"]){
          newDict[box] = false
        }
        form_color(newDict)
        if(error_msg.length > 0){
          throw error_msg
        }
        throw(jsonData["data"]["error_msg"])
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

function submitButton(col){
  let button = document.createElement("button")
  button.classList.add("btn", "btn-primary", "btn-block", "edit-border")
  button.innerHTML = "Submit"
  button.id = "submit"

  button.addEventListener("click", handleSubmit)
  button.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  });
  

  col.appendChild(button)
}

function handleCancel(){
  const passwordElements = document.querySelectorAll('#password');
  const button = document.getElementById("button")
  const cancel = document.getElementById("cancel")
  const userElements = document.querySelectorAll('#user-info');
  for(elem of passwordElements){
    elem.remove()
  }
  for(i in accounts){
    userElements[i].value = user[accounts[i]["key"]]
    userElements[i].disabled = true
  }
  cancel.innerHTML = ""
  button.innerHTML = ""
  editButton(button)
}

function cancelButton(col){
  let button = document.createElement("div")
  button.classList.add("btn", "btn-danger", "btn-block", "edit-border")
  button.innerHTML = "Cancel"
  button.id = "cancel"
  col.appendChild(button)

  button.addEventListener("click", handleCancel);
}

let user = null;
async function getUsername(){
    await getUser()
    .then(jsonData =>{
        user = jsonData
    })
    let account_card = document.getElementById("update")
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
        
        let input_group_append_2 = document.createElement("input")
        input_group_append_2.classList.add("form-control", "form-helper")
        input_group_append_2.id = "user-info"
        input_group_append_2.value = user[account["key"]]
        input_group_append_2.type = "text"
        input_group_append_2.disabled = true
        input_group_append_2.setAttribute('name', account["key"]);
        input_group.appendChild(input_group_append_2)

        let input_group_append_3 = document.createElement("div")
        input_group_append_3.classList.add("input-group-append")
        input_group.appendChild(input_group_append_3)

        let input_group_text_3 = document.createElement("div")
        input_group_text_3.classList.add("input-group-text", "text-symbol")
        input_group_text_3.setAttribute('name', account["key"]);
        input_group_append_3.appendChild(input_group_text_3)

        let symbol = document.createElement("span")
        symbol.classList.add("fas", account["symbol"])
        symbol.setAttribute('name', account["key"]);
        input_group_text_3.appendChild(symbol)
    }
    let row = document.createElement("div")
    row.classList.add("row")
    row.id = "row_button"
    account_card.appendChild(row)

    let cancel = document.createElement("div")
    cancel.classList.add("col-4")
    cancel.id = "cancel"
    row.appendChild(cancel)

    let col_4 = document.createElement("div")
    col_4.classList.add("col-4")
    row.appendChild(col_4)

    let button = document.createElement("div")
    button.classList.add("col-4")
    button.id = "button"
    row.appendChild(button)

    editButton(button)
}
getUsername()