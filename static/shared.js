async function verify(){
    let myValue = sessionStorage.getItem('token');
    user_id = null
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
          console.log(jsonData)
          user = jsonData["data"]
        })
        .catch(function(err) {
          console.info(err + " url: " + url)
        });
        
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
    return user
}