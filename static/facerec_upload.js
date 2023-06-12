var loadFile = function(event, output) {
              var image = document.getElementById(output);
              image.src=URL.createObjectURL(event.target.files[0]);
};