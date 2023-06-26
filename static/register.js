// import JSEncrypt from "jsencrypt";
const form = document.getElementById("register")

// async function load_publicKey() {
//   let key = await fetch('/public-key');
//   let json = await key.json()
//   return json["publicKey"]
// }

// async function encryptRSA(publicKey, plaintext) {
//   return new Promise((resolve, reject) => {
//     let encrypt = new JSEncrypt();
//     console.log(publicKey)
//     console.log(typeof(publicKey))
//     let exam = 
//     "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQK" +
//     "BgQCQDxDFOYJpkCaqeX4CBVNCtBjXMZgGMo" +
//     "lSs2wYrVu1ixr36KpeJcRcYhz+AnyhnUpYkgk" +
//     "+hEqJtDSNirU5Dk5oVYYigf2uLogV5Tp/ka" +
//     "K49r9vtxldcHraZIgNQjcdeQUd/viKd/3DvM8" +
//     "naWR/mTG0nCBErEQkATW/xXynJh/COQIDAQ" +
//     "AB"
//     console.log(exam)
//     console.log(typeof(exam))
//     encrypt.setPublicKey(pkcs1PrivateKey);
//     let encrypted = encrypt.encrypt(plaintext);
//     if (encrypted) {
//       console.log(encrypted)
//       resolve(encrypted);
//     } else {
//       reject(new Error('RSA encryption failed'));
//     }
//   });

// }

// function convertToPem(publicKeyString) {
//   // Remove leading and trailing whitespace
//   publicKeyString = publicKeyString.trim();

//   // Extract the base64-encoded key from the string
//   const base64Key = publicKeyString.match(/-----BEGIN RSA PUBLIC KEY-----(.*)-----END RSA PUBLIC KEY-----/s)[1].trim();

//   // Decode the base64 key
//   const binaryKey = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));

//   // Convert the binary key to PEM format
//   const pemKey = `${btoa(String.fromCharCode.apply(null, binaryKey))}`;
//   return pemKey;
// }

async function handleSubmit(event) {
  event.preventDefault();
  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    // const publicKey = await load_publicKey();
    // let key = convertToPem(publicKey)
    // data.password = await encryptRSA(key, data.password);
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
    //   sessionStorage.setItem('token', jsonData.data.token);
    //   let myValue = sessionStorage.getItem('token');
    //   window.location.href = '/';
    })
    .catch(function(err) {
      console.info(err + " url: " + url)
    });
    
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle the error appropriately (e.g., show an error message to the user)
  }
}

form.addEventListener('submit', handleSubmit);


