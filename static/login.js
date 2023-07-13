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

async function handleSubmit(event) {
  event.preventDefault();
  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    let [error_msg, newDict] = form_login_error(data)

    const publicKey = await load_publicKey();
    data.password = await encryptRSA(publicKey, data.password);
    const json = JSON.stringify(data);
    const url = "/login-route"

    await fetch(url, {
      method: "POST",
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
        sessionStorage.setItem('token', jsonData.data.token);
        window.location.href = '/';
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
let form = document.getElementById("login");
form.addEventListener('submit', handleSubmit);
form.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    handleSubmit(event);
  }
});


