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
  if (user != null){
    window.location.href = '/';
    alert("You are logged in")
  }
  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
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
      referrer: "/"
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
      sessionStorage.setItem('token', jsonData.data.token);
      let myValue = sessionStorage.getItem('token');
      console.log(myValue)
      window.location.href = '/';
    })
    .catch(function(err) {
      console.info(err + " url: " + url)
    });
    
  } catch (error) {
    console.error('An error occurred:', error);
    console.error(response.json())  
  }
}
let user = await verify()
if (user != null){
  window.location.href = '/';
  alert("You already logged in")
}
const form = document.getElementById("login")
form.addEventListener('submit', handleSubmit);


