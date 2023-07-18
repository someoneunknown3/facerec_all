function redirect(){
    verify().then(data => {
      if(data != undefined){
        window.location.href = '/';
      }
    })
  }
  redirect()