async function getData() {
    // get our objectID
    const queryString = window.location.search;
    const objectId = new URLSearchParams(queryString).get('id');
    let url = `http://localhost:3000/api/products/${objectId}`;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderData() {
    let data = await getData();
    console.log(data);
    // Add img
    document.title = data.name;
    let item_img = document.getElementsByClassName("item__img")[0];
    let img = document.createElement("img");
    img.src = data.imageUrl;
    img.alt = data.altTxt;
    item_img.appendChild(img);

    //  Add Price
    document.getElementById("price").innerHTML = `${data.price}`;

    // Add description
    document.getElementById("description").innerHTML = `${data.description}`;

    // Add Colors

    (data.colors).forEach(color => {
        let htmlSegment = document.createElement('option');
        htmlSegment.innerHTML = `<option value="${color}">${color}</option>`
        const colorHTML = document.getElementById("colors");
        colorHTML.appendChild(htmlSegment);
    });

}

renderData();

function addOrder() {
    const quantity = document.querySelector('input').value;
    const id = new URLSearchParams(window.location.search).get('id');
    const color = document.getElementById('colors').value
    let tempData = localStorage.getItem("items");
    let temp = JSON.parse(tempData);
    let itemLocalData = [];
    let itemData = {
        quantity: quantity,
        id: id,
        color: color,
    }
    if (temp) {
        let nb = parseInt(quantity) + parseInt(temp.quantity);
        if (temp && temp.color == color) {
            itemData.quantity = nb;
        }
        if (Array.isArray(temp)) {
            for (let i = 0; temp[i]; i++) {
                if (temp[i].color == color && temp[i].id == id) {
                    let tempNb = parseInt(temp[i].quantity) + parseInt(quantity);
                    itemData.quantity = tempNb.toString();
                } else {
                    itemLocalData.push(temp[i]);
                }
            }
        }
    }

    itemLocalData.push(itemData);
    let itemJSON = JSON.stringify(itemLocalData);
    localStorage.setItem("items", itemJSON);

    alert(localStorage.getItem("items"));
}