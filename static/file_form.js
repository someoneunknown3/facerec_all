function form_file_error(form){
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
        normalBox(elem)
      }
      else{
        redBox(elem)
      }
    }
  }


function redBox(str){
    let tag = document.getElementById(str);
    tag.style.borderColor = "red";
}
  
function normalBox(str){
    let tag = document.getElementById(str);
    tag.removeAttribute("style");
}