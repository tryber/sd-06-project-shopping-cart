function saveShoppingCartStatus() {
  const shoppingCart = document.querySelector('.cart__items');
  localStorage.shoppingCart = shoppingCart.innerHTML;
}

function retrieveShoppingCart() {
  const shoppingCart = document.querySelector('.cart__items');
  shoppingCart.innerHTML = localStorage.shoppingCart;
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveShoppingCartStatus();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addProductToCart(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;

  const response = await fetch(endpoint);
  const product = await response.json();
  const formattedProduct = createCartItemElement(product);
  const cartContainer = document.querySelector('.cart__items');
  cartContainer.appendChild(formattedProduct);
  saveShoppingCartStatus();
}

function formatListOfProducts(listOfProducts) {
  listOfProducts.forEach(({ id, title, thumbnail }) => {
    const product = createProductItemElement({ sku: id, name: title, image: thumbnail });
    const productsContainer = document.querySelector('.items');
    product.children[3].addEventListener('click', function () {
      const productId = product.children[0].innerText;
      addProductToCart(productId);
    });
    productsContainer.appendChild(product);
  });
}

async function fetchProducts(query = 'computador') {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  const response = await fetch(endpoint);
  const data = await response.json();
  const results = data.results;
  formatListOfProducts(results);
}

function loadStorage() {
  retrieveShoppingCart();

  const cartItems = document.querySelectorAll('.cart__items');
  cartItems.forEach((cartItem) => {
    cartItem.addEventListener('click', cartItemClickListener);
  });
}

function removeAllProductsFromCart() {
  const buttonRemoveAll = document.querySelector('.empty-cart');
  buttonRemoveAll.addEventListener('click', function () {
    const shoppingCart = document.querySelector('.cart__items');
    while (shoppingCart.firstChild) {
      shoppingCart.removeChild(shoppingCart.firstChild);
    }
    saveShoppingCartStatus();
  });
}

window.onload = async function onload() {
  await fetchProducts();

  if (localStorage.shoppingCart) {
    loadStorage();
  }

  removeAllProductsFromCart();
};
