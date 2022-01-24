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

async function updatePriceQuantity(localStorage) {
  let price = 0;
  let quantity = 0;

  // Calcul du prix du panier
  for (let i = 0; localStorage[i]; i++) {
    let data = await getDataById(localStorage[i].id);
    price += parseInt(localStorage[i].quantity) * parseInt(data.price);
    quantity += parseInt(localStorage[i].quantity);
  }
      // Add Price & Quantity
      document.getElementById('totalPrice').textContent = `${price}`
      document.getElementById('totalQuantity').textContent = `${quantity}` 
}

async function renderItems() {
    const localItems = getItemsFromLocalStorage();

    for (let i = 0; localItems[i]; i++) {
        let data = await getDataById(localItems[i].id);
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
                      <button class="deleteItem" key="${localItems[i].id}" onclick="deleteNode('${localItems[i].id}', '${localItems[i].color}')">Supprimer</button>
                    </div>
                  </div>
                </div>
        `
        document.getElementById("cart__items").appendChild(elem);

    }

    updatePriceQuantity(localItems);
}

function deleteNode(id, color) {

  let array = getItemsFromLocalStorage();

  // ----- Find the index of our cart to remove it ----- //
    // 1. Create an array of id from local storage
  let idArray = [];
  for (let i = 0; array[i]; i++)
    idArray.push(array[i].id);

    // 2. Delete the html article related to this id
  let cartItems = document.getElementById("cart__items");
  let cartItem = document.querySelector(`[data-id="${id}"][data-color="${color}"]`);
  cartItems.removeChild(cartItem);
    // ----- Update localStorage without our deleted item ----- //
  let result = array.filter(node => (id != node.id || color != node.color));
  localStorage.setItem("items", JSON.stringify(result));
      
    // ----- Update price and quantity ----- //
    updatePriceQuantity(result);
}

renderItems();