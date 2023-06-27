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
      if (data["password"] != data["retype"]){
        throw "Retype the same password"
      }
        
      const publicKey = await load_publicKey();
      data.password = await encryptRSA(publicKey, data.password);
      data.retype = await encryptRSA(publicKey, data.retype);
      const json = JSON.stringify(data);
      const url = "/register-route"
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
          // window.location.href = '/';
        } else {
          // Handle unsuccessful response
          console.error('Error:', response.status);
        }
      })
      .then(jsonData =>{
        console.log(jsonData)
        sessionStorage.setItem('token', jsonData.data.token);
        let myValue = sessionStorage.getItem('token');
        console.log(myValue)
        // window.location.href = '/';
      })
      .catch(function(err) {
        console.info(err + " url: " + url)
      });
      
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  }
let user = await verify()
console.log(user)
if (user != null){
  window.location.href = '/';
  alert("You already logged in")
}
const form = document.getElementById("register")
form.addEventListener('submit', handleSubmit);


