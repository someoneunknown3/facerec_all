function form_register_error(form){
  let error = []
  let newDict = {...form};

  for(elem in form){
    if(form[elem] == ""){
      error.push(elem.charAt(0).toUpperCase() + elem.slice(1) + " is empty")
      newDict[elem] = false
    }
    else{
      newDict[elem] = true
    }
  }

  if (form["password"] != "" && !passwordVerification(form["password"])){
    newDict["password"] = false
    newDict["retype"] = false
    error.push("Password needs capital letters, number, and atleast 8 in length")
  }
  else if (form["password"] != form["retype"]){
    newDict["retype"] = false
    error.push("Retype needs to be the same as password")
  }

  return [error, newDict]
}

function form_login_error(form){
  let error = []
  let newDict = {...form};
  for(elem in form){
    if(form[elem] == ""){
      error.push(elem.charAt(0).toUpperCase() + elem.slice(1) + " is empty")
      newDict[elem] = false
    }
    else{
      newDict[elem] = true
    }
  }
  return [error, newDict]
}

function form_color(form){
  for(elem in form){
    if(form[elem]){
      greenBox(elem)
    }
    else{
      redBox(elem)
    }
  }
}

function redBox(str){
  let tags = document.getElementsByName(str);
  tags[0].style.border = "1px solid red";
  tags[0].style.borderRight = "0";
  tags[1].style.border = "1px solid red";
  tags[1].style.borderLeft = "0";
  tags[2].className = "";
  tags[2].classList.add("fas", "fa-exclamation-circle")
  tags[2].style.color = "red"
}

function greenBox(str){
  let tags = document.getElementsByName(str);
  tags[0].style.border = "1px solid green";
  tags[0].style.borderRight = "0";
  tags[1].style.border = "1px solid green";
  tags[1].style.borderLeft = "0";
  tags[2].className = "";
  tags[2].classList.add("fas", "fa-check")
  tags[2].style.color = "green"
}

function hasNumbers(inputString) {
  return /\d/.test(inputString);
}

function hasUpper(inputString) {
  return /[A-Z]/.test(inputString);
}

function lengthValid(inputString) {
  return inputString.length >= 8;
}

function passwordVerification(password) {
  return lengthValid(password) && hasNumbers(password) && hasUpper(password);
}
