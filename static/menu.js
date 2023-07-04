function create_load(){
    let loader = document.createElement("div");
    loader.classList.add("preloader", "flex-clumn", "justify-content-center", "align-items-center");

    let image = document.createElement("img")
    image.src = "static/dist/img/AdminLTELogo.png"
    image.classList.add("animation__wobble")
    image.alt = "Logo"
    image.height = "60"
    image.width = "60"

    loader.appendChild(image);

    let wrapper = document.getElementById("wrapper")
    wrapper.prepend(loader)
}

async function handleLogout(){
  try {
    sessionStorage.removeItem('token');
    token = sessionStorage.getItem('token');

    data = {
      "success": (token == null)
    }
    const json = JSON.stringify(data);
    const url = "logout"
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
        return response.json()
      } else {
        console.error('Error:', response.status);
        console.error(response.json())
      }
    })
    .then(jsonData =>{
      console.log(jsonData)
    })
    .catch(function(err) {
      console.info(err + " url: " + url)
    });
    
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function create_navbar(){
    let user = await getUser()
    let navbar = document.createElement("nav");
    navbar.classList.add("main-header", "navbar", "navbar-expand", "navbar-dark");

    let nav_ul_left = document.createElement("ul")
    nav_ul_left.classList.add("navbar-nav");
    
    let nav_li_left = document.createElement("li")
    nav_li_left.classList.add("nav-item")

    let link_left = document.createElement("a")
    link_left.classList.add("nav-link")
    link_left.setAttribute("data-widget", "pushmenu")
    link_left.role = "button"

    let bars = document.createElement("i")
    bars.classList.add("fas", "fa-bars")

    link_left.appendChild(bars)
    nav_li_left.appendChild(link_left)
    nav_ul_left.appendChild(nav_li_left)

    let nav_ul_right = document.createElement("ul")
    nav_ul_right.classList.add("navbar-nav", "ml-auto");

    let nav_li_right = document.createElement("li")
    // nav_li_right.classList.add("nav-item", "dropdown")

    let link_right = document.createElement("a")
    link_right.classList.add("nav-link")
    // link_right.setAttribute("data-toggle", "dropdown")

    let user_panel = document.createElement("div")
    user_panel.classList.add("user-panel", "pb-3", "mb-3", "d-flex")
    user_panel.setAttribute('role', 'button');
    if(user != null){
      nav_li_right.classList.add("nav-item", "dropdown")
      link_right.setAttribute("data-toggle", "dropdown")
      let image = document.createElement("div")
      image.classList.add("image")
      let name = document.createElement("div")
      name.innerHTML = user["name"]

      let img = document.createElement("img")
      img.src = "static/dist/img/default-150x150.png"
      img.classList.add("img-circle", "elevation-2")
      img.alt = "User Image"

      image.appendChild(img)
      user_panel.appendChild(name)
      user_panel.appendChild(image)
  
      let dropdown = document.createElement("div")
      dropdown.classList.add("dropdown-menu", "dropdown-menu-lg", "dropdown-menu-right")
      let link_drop_1 = document.createElement("a")
      link_drop_1.setAttribute('role', 'button');
      link_drop_1.classList.add("dropdown-item", "dropdown-footer")
      link_drop_1.innerHTML = "Account"
      let line_1 = document.createElement("div")
      line_1.classList.add("dropdown-divider")
      let link_drop_2 = document.createElement("a")
      link_drop_2.setAttribute('role', 'button');
      link_drop_2.classList.add("dropdown-item", "dropdown-footer")
      link_drop_2.innerHTML = "Settings"
      let line_2 = document.createElement("div")
      line_2.classList.add("dropdown-divider")
      let link_drop_3 = document.createElement("a")
      link_drop_3.setAttribute('role', 'button');
      link_drop_3.classList.add("dropdown-item", "dropdown-footer")
      link_drop_3.innerHTML = "Logout"
      link_drop_3.addEventListener("click", async function(event) {
        event.preventDefault();
        await handleLogout();
        window.location.href = '/';
      });

      dropdown.appendChild(link_drop_1)
      dropdown.appendChild(line_1)
      dropdown.appendChild(link_drop_2)
      dropdown.appendChild(line_2)
      dropdown.appendChild(link_drop_3)
      nav_li_right.appendChild(dropdown)
    }
    else{
      user_panel.innerHTML = "Sign in"
      link_right.href = "login"
    }
    link_right.appendChild(user_panel)
    nav_li_right.appendChild(link_right)

    nav_ul_right.appendChild(nav_li_right)
    navbar.appendChild(nav_ul_left);
    navbar.appendChild(nav_ul_right)    

    let wrapper = document.getElementById("wrapper")
    wrapper.prepend(navbar)
}

function create_sidebar(){
  let sidebar = document.createElement("aside")
  sidebar.classList.add("main-sidebar", "main-sidebar-custom","sidebar-dark-primary", "elevation-4")

  let home = document.createElement("a")
  home.classList.add("brand-link")
  home.href = "/"

  let homeImage = document.createElement("img")
  homeImage.classList.add("brand-image", "img-circle", "elevation-3")
  homeImage.style.opacity = "0.8"
  homeImage.alt = "Logo"
  homeImage.src = "static/dist/img/AdminLTELogo.png"
  let homeText = document.createElement("span")
  homeText.classList.add("brand-text", "font-weight-light")
  homeText.innerHTML = "Face Rec"

  home.appendChild(homeImage)
  home.appendChild(homeText)
  sidebar.appendChild(home)

  let side_option = document.createElement("div")
  side_option.classList.add("sidebar")

  let nav = document.createElement("nav")
  nav.classList.add("mt-2")

  let ul = document.createElement("ul")
  ul.classList.add("nav", "nav-pills", "nav-sidebar", "flex-column")
  ul.setAttribute("data-widget", "treeview")
  ul.setAttribute('role', 'menu');
  ul.dataset.accordion = 'false';

  let options = [{href:"compare", text:"Compare", icon:"fa-image"}, 
              {href:"enroll", text:"Enroll", icon:"fa-th"},
              {href:"log", text:"Log", icon:"fa-th"},
              {href:"detect", text:"Detect", icon:"fa-image"}]

  for (op in options){
    let li = document.createElement("li")
    li.classList.add("nav-item")

    let link = document.createElement("a")
    link.classList.add("nav-link")
    link.href = options[op].href

    let icon = document.createElement("i")
    icon.classList.add("nav-icon", "fas", options[op].icon)

    let text = document.createElement("p")
    text.innerHTML = options[op].text

    icon.appendChild(text)
    link.appendChild(icon)
    li.appendChild(link)
    ul.appendChild(li)
  }

  nav.appendChild(ul)
  side_option.appendChild(nav)
  sidebar.appendChild(side_option)

  let wrapper = document.getElementById("wrapper")
  wrapper.prepend(sidebar)
}

create_sidebar();
create_navbar();
create_load();