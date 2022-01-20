async function getDataById(id) {
    let url = `http://localhost:3000/api/products/${id}`

    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

function getItemsFromLocalStorage() {
    let items = localStorage.getItem("items");
    return JSON.parse(items);
}

async function renderItem(item) {
    console.log(item);
}

async function renderItems() {
    const localItems = getItemsFromLocalStorage();
    let price = 0;
    let quantity = 0;
    for (let i = 0; localItems[i]; i++) {
        let data = await getDataById(localItems[i].id);
        price += parseInt(localItems[i].quantity) * parseInt(data.price);
        quantity += parseInt(localItems[i].quantity);

        let elem = document.createElement('article');
        elem.classList.add("cart__item");
        elem.setAttribute("data-id", localItems[i].id);
        elem.setAttribute("data-color", localItems[i].color);
        elem.innerHTML = `
        <div class="cart__item__img">
                  <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${localItems[i].color}</p>
                    <p>${parseInt(localItems[i].quantity) * parseInt(data.price)}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : ${localItems[i].quantity}</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem" key="${localItems[i].id}">Supprimer</p>
                    </div>
                  </div>
                </div>
        `
        document.getElementById("cart__items").appendChild(elem);

    }

    // Add Price & Quantity
    document.getElementById('totalPrice').textContent = `${price}`
    document.getElementById('totalQuantity').textContent = `${quantity}` 
}

renderItems();