/**
 * @param  {} id
 * get data from the API for a specifical ID
 */
async function getDataById(id) {
  let url = `http://localhost:3000/api/products/${id}`

  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error(error);
  }
}
/**
 * get localStorage
 */
function getItemsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("items"));
}

/**
 * update the Price and Quantity in the rendered HTML
 */
async function updatePriceQuantity() {
  let localStorage = getItemsFromLocalStorage();
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
/**
 * @param  {HTMLElement} q
 * @param  {string} id
 * @param  {string} color
 * update localStorage when a quantity change is triggered
 */
async function updateQtyLocalStorage(q, id, color) {
  let array = getItemsFromLocalStorage();
  let idArray = [];
  let index;
  // error handling
  if (q.target.value <= 0)
    return -1;
  // ----- get the index of our item in our array ----- //
  for (let i = 0; array[i]; i++) {
    if (array[i].id == id && array[i].color == color)
      index = i;
    idArray.push(array[i].id);
  }

  // ----- change the value of the quantity and push it to localStorage ----- //
  array[index].quantity = q.target.value;
  localStorage.setItem("items", JSON.stringify(array));
  // ----- Update our innerHtml ----- //
  let quantityHTML = document.querySelector(`[data-id="${id}"][data-color="${color}"] [class="cart__item__content__settings__quantity"]`);
  quantityHTML.firstElementChild.textContent = `Qté : ${q.target.value}`

  let priceHTML = document.querySelector(`[data-id="${id}"][data-color="${color}"] [class="cart__item__content__description"]`)
  let temp = await getDataById(id);
  priceHTML.lastChild.textContent = `${q.target.value * temp.price} €`
  updatePriceQuantity();
}
/**
 * render our shopping Cart items dynamically
 */
async function renderItems() {
  const localItems = getItemsFromLocalStorage();
  // create a HTMLElement for each item in localStorage
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
    <p>${parseInt(localItems[i].quantity) * parseInt(data.price)} €</p></div>
    <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
    <p>Qté : ${localItems[i].quantity}</p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${localItems[i].quantity}>
    </div>
    <div class="cart__item__content__settings__delete">
    <button class="deleteItem" key="${localItems[i].id}" onclick="deleteNode('${localItems[i].id}', '${localItems[i].color}')">Supprimer</button>
    </div>
    </div>
    </div>
    `
    // Add an event listener to the quantity input to refresh DOM and localStorage
    document.getElementById("cart__items").appendChild(elem);
    let qtyInput = elem.getElementsByClassName('itemQuantity');
    qtyInput[0].addEventListener('change', (e) => {
      updateQtyLocalStorage(e, localItems[i].id, localItems[i].color);
    });
  }
  updatePriceQuantity(localItems);
}
/**
 * @param  {} id
 * @param  {} color
 * delete an item from localStorage
 */
function deleteNode(id, color) {

  let array = getItemsFromLocalStorage();

  // ----- Find the index of our cart to remove it ----- //
  // --- Delete the html article related to our id --- //
  let cartItems = document.getElementById("cart__items");
  let cartItem = document.querySelector(`[data-id="${id}"][data-color="${color}"]`);
  cartItems.removeChild(cartItem);
  // ----- Update localStorage without our deleted item ----- //
  let result = array.filter(node => (id != node.id || color != node.color));
  localStorage.setItem("items", JSON.stringify(result));

  // ----- Update price and quantity ----- //
  updatePriceQuantity();
}


renderItems();


  // FORM
/**
 * @param  {} input
 * @param  {} message
 * @param  {} type
 * Show a message in function of the type
 */
function showMessage(input, message, type) {
  const msg = input.parentNode.querySelector("#ErrorMsg");
  msg.innerText = message;

  if (type)
    msg.innerText = '';
  return type;
}
/**
 * @param  {} input
 * @param  {} message
 * show an Error
 */
function showError(input, message) {
  return showMessage(input, message, false);
}
/**
 * @param  {} input
 * show nothing if success
 */
function showSuccess(input) {
  return showMessage(input, "", true);
}
/**
 * @param  {} input
 * @param  {} message
 * check if input has a value
*/
function hasValue(input, message) {
  if (input.value.trim() === "")
    return showError(input, message);
  return showSuccess(input);
}
/**
 * @param  {} input
 * @param  {} requiredMsg
 * @param  {} invalidMsg
 * check if name is valid
 */
function validateName(input, requiredMsg, invalidMsg) {
  // check if the value is not empty
  if (!hasValue(input, requiredMsg)) {
    return false;
  }
  const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g;
  const name = input.value;
  if (!nameRegex.test(name)) {
    return showError(input, invalidMsg);
  }
  return true;
}
/**
 * @param  {} input
 * @param  {} requiredMsg
 * @param  {} invalidMsg
 * check if email is valid
*/
function validateEmail(input, requiredMsg, invalidMsg) {
  // check if the value is not empty
  if (!hasValue(input, requiredMsg)) {
    return false;
  }
  // validate email format
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const email = input.value.trim();
  if (!emailRegex.test(email)) {
    return showError(input, invalidMsg);
  }
  return true;
}

const form = document.getElementsByClassName('cart__order__form')[0];
const errName = 'Please enter your name !';
const nameErr = 'Please enter a correct name !'
const errAddress = 'Please enter your address !';
const errCity = 'Please enter your city !'
const errMail = 'please enter your mail !';
const mailErr = 'Please enter a correct email address format';

// add an event listener on our submit button
form.addEventListener("submit", (e) => {
  // stop submission
  e.preventDefault();

  // validate each input in the form
  let nameValid = validateName(form.elements["firstName"], errName, nameErr);
  let lastNameValid = validateName(form.elements["lastName"], errName, nameErr);
  let adressValid = hasValue(form.elements["address"], errAddress);
  let emailValid = validateEmail(form.elements["email"], errMail, mailErr);
  // push data
  if (emailValid && nameValid && lastNameValid && adressValid) {
    let inputName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputAdress = document.getElementById('address');
    let inputCity = document.getElementById('city');
    let inputMail = document.getElementById('email');
    let idProducts = [];
    let data = getItemsFromLocalStorage();
    for (let i = 0; data[i]; i++)
      idProducts.push(data[i].id);
    const order = {
      contact: {
        firstName: inputName.value,
        lastName: inputLastName.value,
        address: inputAdress.value,
        city: inputCity.value,
        email: inputMail.value,
      },
      products: idProducts,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
      },
    };

    fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.clear();
        localStorage.setItem("orderId", data.orderId);

        document.location.href = "confirmation.html";
      })
      .catch((err) => {
        alert("Problème avec fetch : " + err.message);
      });
  }
})