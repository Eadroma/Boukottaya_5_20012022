// get our orderId HTML element
const idNode = document.getElementById("orderId");
// add the orderId to the HTML element
idNode.innerText = localStorage.getItem("orderId");
localStorage.clear();