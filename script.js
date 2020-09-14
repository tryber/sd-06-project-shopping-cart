async function cartItemsTotalPrice() {
  // Selecionei o meu carrinho
  const cartItems = document.querySelectorAll('.cart__item');
  // Selecionei o preço total do carrinho
  const cartItemsTotalPrices = document.querySelector('.total-price');
  // Definição de variavel para guardar o valor da soma de cada preço
  let sumOfCartItemsPrice = 0;
  // Para cada Item do carrinho passei para num. a string selecionada após o $
  // que é o valor do nosso respectivo item do carrinho
  cartItems.forEach((item) => {
    const itemPrice = parseFloat(item.innerHTML.split('$')[1]);
    // Adiciona esse valor à nossa soma
    sumOfCartItemsPrice += itemPrice;
  });
  // Define o valor atual da soma como o valor do nosso preço total do carrinho
  cartItemsTotalPrices.innerHTML = sumOfCartItemsPrice;
}

function saveShoppingCart() {
  const shoppingCart = document.querySelector('.cart__items').innerHTML;
  localStorage.shopCart = shoppingCart;
}

function loadSavedShoppingCart() {
  if (localStorage.shopCart) {
    document.querySelector('.cart__items').innerHTML = localStorage.shopCart;
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveShoppingCart();
  // Ao remover o item do carrinho já quero que seja calculado o novo valor.
  cartItemsTotalPrice();
}

// Allow to remove items from cart after refresh page!
function removeItemFromCartAfterPageRefresh() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(item => item.addEventListener('click', cartItemClickListener));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart(item) {
  const myCart = document.querySelector('.cart__items');
  myCart.appendChild(item);
}

function fetchSpecificMLItem(id) {
  const specificMLItemEndpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(specificMLItemEndpoint)
    .then(response => response.json())
    .then(object => addItemToCart(createCartItemElement(object)))
    .then(() => saveShoppingCart())
    // Aqui ao adicionar meu item ao carrinho rodo a função de fazer a soma pq a cada
    // item adicionado ao carrinho já temos um novo valor
    .then(() => cartItemsTotalPrice());
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', (event) => {
    const itemID = event.currentTarget.parentElement.firstChild.innerText;
    fetchSpecificMLItem(itemID);
    saveShoppingCart();
  });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchMLComputers() {
  const MLComputerEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(MLComputerEndpoint)
    .then(response => response.json())
    .then(object => object.results.forEach(product =>
      document.querySelector('.items')
      .appendChild(createProductItemElement(product))));
}

window.onload = function onload() {
  fetchMLComputers();
  loadSavedShoppingCart();
  removeItemFromCartAfterPageRefresh();
  // Coloquei a função aqui para carregar ao fazer o load da window
  cartItemsTotalPrice();

  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const myCart = document.querySelector('.cart__items');
    myCart.innerHTML = '';
    localStorage.clear();
  });
};
