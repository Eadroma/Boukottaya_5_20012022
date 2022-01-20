async function getData() {
    // get our objectID
    const queryString = window.location.search;
    const objectId = new URLSearchParams(queryString).get('id');
    console.log(objectId);
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