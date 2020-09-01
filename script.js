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

  await fetch(endpoint)
    .then(response => response.json())
    .then((product) => {
      const formattedProduct = createCartItemElement(product);
      const cartContainer = document.querySelector('.cart__items');
      cartContainer.appendChild(formattedProduct);
      saveShoppingCartStatus();
    });
}

async function fetchProducts(query = 'computador') {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  await fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const results = data.results;
      results.forEach(({ id, title, thumbnail }) => {
        const product = createProductItemElement({ sku: id, name: title, image: thumbnail });
        const productsContainer = document.querySelector('.items');
        product.children[3].addEventListener('click', function () {
          const productId = product.children[0].innerText;
          addProductToCart(productId);
        });
        productsContainer.appendChild(product);
      });
    });
}

function saveShoppingCartStatus() {
  const shoppingCart = document.querySelector('.cart__items');
  localStorage.shoppingCart = shoppingCart.innerHTML;
}

function retrieveShoppingCart() {
  const shoppingCart = document.querySelector('.cart__items');
  shoppingCart.innerHTML = localStorage.shoppingCart;
}

function loadStorage() {
  retrieveShoppingCart();

  const cartItems = document.querySelectorAll('.cart__items')
  cartItems.forEach((cartItem) => {
    cartItem.addEventListener('click', cartItemClickListener)
  })
}

window.onload = async function onload() {
  await fetchProducts();
  
  if (localStorage.shoppingCart) {
    loadStorage();
  }
};
