async function getLog(page = 1, limit = 10, sort = 'DSC', sort_by = 'date'){
    const url_param = "page=" + page + "&" + "limit=" + limit +  "&" + "sort=" + sort + "&" +"sort_by=" + sort_by
    const url = '/log-page?' + url_param
    return await fetch(url)
    .then(response => {
        if(response.ok){
            return response.json()
        }
        else {
            console.error('Error:', response.status);
            console.error(response.json())
        }
    })
    .then(data => {
        return data["data"]
    })
    .catch(function(err) {
        console.info(err + " url: " + url)
    });
}

async function handleSort(column, page, limit, sort, sort_by) {
    let direction = "ASC"
    if(sort_by == column && sort == "ASC"){
        direction = "DSC"
    }
    let table_head = document.getElementById("table_head");
    table_head.innerHTML = '';
    let table_body = document.getElementById("table_body");
    table_body.innerHTML = '';
    let entries = document.getElementById("entries")
    entries.innerHTML = '';
    const elements = document.querySelectorAll("#page");
    elements.forEach(element => element.remove());
    createGrid(page, limit, direction, sort_by);
}

async function handlePagination(page, limit, sort, sort_by) {
    let table_head = document.getElementById("table_head");
    table_head.innerHTML = '';
    let table_body = document.getElementById("table_body");
    table_body.innerHTML = '';
    let entries = document.getElementById("entries")
    entries.innerHTML = '';
    const elements = document.querySelectorAll("#page");
    elements.forEach(element => element.remove());
    createGrid(page, limit, sort, sort_by);
}


async function createGrid(page = 1, limit = 10, sort = 'DSC', sort_by = 'date') {
    try {
      let data = await getLog(page, limit, sort, sort_by);
      let items = data["items"]
      let table_head = document.getElementById("table_head");
      let head_tr = document.createElement("tr")
      table_head.appendChild(head_tr)
      let current_page = data["current_page"]
      let item_per_page = data["item_per_page"]
      let direction = data["sort"]
      let column = data["sort_by"]
      let total_count = data["total_count"]
      let total_page = data["total_page"]
      let item_this_page = data["item_this_page"]
      for(let key in items[0]){
        let head_th = document.createElement("th")
        let arrow = ""
        if(key == column){
            if(direction == "ASC"){
                arrow = "\u2193"
            }
            else if(direction == "DSC"){
                arrow = "\u2191"
            }
        }
        head_th.innerHTML = key.charAt(0).toUpperCase() + key.slice(1) + " " + arrow;
        head_tr.appendChild(head_th)
        head_th.addEventListener('click', () => 
            handleSort(column, current_page, 
                item_per_page, 
                direction, 
                key));
      }
      let table_body = document.getElementById("table_body");
      for(let item of items){
        let body_tr = document.createElement("tr")
        for(let i in item){ 
            let item_td = document.createElement("td")
            item_td.innerHTML = item[i]
            body_tr.appendChild(item_td)
        }
        table_body.appendChild(body_tr)
      }

      let entries = document.getElementById("entries")
      entries.innerHTML = "Showing " + (limit * (page - 1) + 1) + " to " + (limit * page - (limit - item_this_page)) + " of " + total_count + " entries"
      
      let pagination = document.getElementById("pagination")
      let prev = document.createElement("li");
      prev.id = "page";
      pagination.appendChild(prev);
        
      let prev_link = document.createElement("div");
      prev_link.classList.add("button")
      prev_link.innerHTML = "Previous";

      prev.appendChild(prev_link);
      if(current_page > 1){
        prev_link.classList.add("button-able")
        prev_link.classList.add("btn-success")
        prev_link.addEventListener('click', () => handlePagination(current_page - 1, item_per_page, direction, column));
      }
      else{
        prev_link.classList.add("button-gray") 
      }

      for (let i = Math.max(1, current_page - (total_page - current_page < 1 ? 2 : 1)); i <= Math.min(total_page, current_page + (current_page < 2 ? 2 : 1)); i++) {
        let li = document.createElement("li");
        li.id = "page";
        pagination.appendChild(li);
        
        let div = document.createElement("div");
        div.classList.add("button")
        div.innerHTML = i;
        
        li.appendChild(div);
        if(current_page != i){
            div.classList.add("button-able")
            div.classList.add("btn-success")
            div.addEventListener('click', () => handlePagination(i, item_per_page, direction, column));
        }
        else{
           div.classList.add("button-chosen") 
        }
      }
      let next = document.createElement("li");
      next.id = "page";
      pagination.appendChild(next);
        
      let next_link = document.createElement("div");
      next_link.classList.add("button")
      next_link.innerHTML = "Next";

      next.appendChild(next_link);
      if(current_page < total_page){
        next_link.classList.add("button-able")
        next_link.classList.add("btn-success")
        next_link.addEventListener('click', () => handlePagination(current_page + 1, item_per_page, direction, column));
      }
      else{
        next_link.classList.add("button-gray") 
      }


    } catch (err) {
      console.error(err);
    }
  }
createGrid()