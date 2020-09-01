let totalPrice = 0;

const getTotalPrice = (itemAdd, itemRemove) => {
  const totalPriceContainer = document.getElementById('price');
  if (itemAdd) { totalPrice += itemAdd; }
  if (itemRemove) { totalPrice -= itemRemove; }
  totalPriceContainer.innerText = totalPrice;
};

function cartItemClickListener(event) {
  const itemsList = document.querySelector('.cart__items');
  const localKeys = Object.keys(localStorage);
  const localValues = Object.values(localStorage);
  localKeys.forEach((key, index) => {
    if (event.target.innerText.includes(key)) {
      // removing item from LocalStorage
      getTotalPrice(0, localValues[index]);
      localStorage.removeItem(key);
    }
  });
  // removing item from cart
  itemsList.removeChild(event.target);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const clearCart = (items, button) => {
  button.addEventListener('click', function () {
    // clearing localStorage
    localStorage.clear();
    totalPrice = 0;
    document.getElementById('price').innerText = totalPrice;
    let element = items.lastElementChild;
    // clearing cart one by one
    while (element) {
      items.removeChild(element);
      element = items.lastElementChild;
    }
  });
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const thisButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  thisButton.addEventListener('click', function () {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(r => r.json())
    .then((product) => {
      const item = createCartItemElement(product);
      const shoppingCart = document.querySelector('.cart__items');
      // if (!shoppingCart.innerText.includes(product.id)) {
      // adding item to cart
      shoppingCart.appendChild(item);
      // adding item to localStorage
      localStorage.setItem(product.id, product.price);
      // totalPrice increase
      getTotalPrice(product.price, 0);
      // }
      const clearButton = document.getElementById('empty-cart');
      clearCart(shoppingCart, clearButton);
    });
  });
  section.appendChild(thisButton);
  return section;
}

function appendItem(container, item) {
  container.appendChild(item);
}

const renderProduct = (arrayOfProducts) => {
  arrayOfProducts.forEach((product) => {
    appendItem(document.querySelector('.items'), createProductItemElement(product));
  });
};

const fetchAPI = (endpoint) => {
  fetch(`${'https://api.mercadolibre.com/sites/MLB/search?q='}${endpoint}`)
  .then(response => response.json())
  .then(data => data.results)
  .then((products) => {
    renderProduct(products);
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  fetchAPI('computador');
  const shoppingCart = document.querySelector('.cart__items');
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    fetch(`https://api.mercadolibre.com/items/${key}`)
    .then(r => r.json())
    .then((product) => {
      const item = createCartItemElement(product);
      shoppingCart.appendChild(item);
      getTotalPrice(product.price);
    });
  });
  const cartItems = document.querySelector('#cart-items');
  const clearButton = document.getElementById('empty-cart');
  clearCart(cartItems, clearButton);
};
