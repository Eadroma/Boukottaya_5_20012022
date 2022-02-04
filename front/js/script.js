// Get the data from our API.
async function getData() {
    let url = 'http://localhost:3000/api/products';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}

// Render our products in the html.
async function renderArrayData() {
    let data = await getData();
    let html = '';
    // Render each product in our html element
    data.forEach(data => {
        let htmlSegment = `<a href="./product.html?id=${data._id}">
                            <article>
                            <img src="${data.imageUrl}" alt="${data.altTxt}" />
                            <h3 class="productName">${data.name}</h3>
                            <p class="productDescription">${data.description}</p>
                            </article>
                            <a>`;
        html += htmlSegment;
    });
    // Add the html element with all of our products in the rendered HTML.
    let container = document.querySelector('.items');
    container.innerHTML = html;
}

renderArrayData();