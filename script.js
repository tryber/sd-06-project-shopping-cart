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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function sumCart() {
  try {
    const pricePlacer = document.querySelector('.price .total-price');
    const myCart = document.querySelectorAll('ol.cart__items li');
    if (myCart.length > 0) {
      let sum = 0;
      myCart.forEach((item) => {
        sum += Number(item.dataset.price);
      });
      pricePlacer.innerText = (Number.isInteger(sum)) ? sum : sum.toFixed(1);
    } else {
      pricePlacer.innerText = '-';
    }
  } catch (error) {
    throw new Error('Ocorreu um erro no cálculo do valor de seu carrinho.');
  }
}

let storedIds = [];

function manageCartInStorage(operation, id) {
  storedIds = localStorage.getItem('myCartIds');
  storedIds = (!storedIds) ? [] : storedIds.split(',');

  if (operation === 'add') {
    storedIds.push(id);
    localStorage.setItem('myCartIds', storedIds.toString());
    return 'item added to storage';
  }

  if (operation === 'remove') {
    const indexOfItem = storedIds.indexOf(id);
    if (indexOfItem > -1) storedIds.splice(indexOfItem, 1);
    localStorage.setItem('myCartIds', storedIds.toString());
    return 'item removed from storage.';
  }

  throw new Error('invalid operation for managing of local storage cart.');
}

function cartItemClickListener(event) {
  manageCartInStorage('remove', event.target.id);
  event.target.remove();
  sumCart()
    .catch(error => console.log(error));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.setAttribute('data-price', salePrice);
  li.setAttribute('data-title', name);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(url, id) {
  if (storedIds && storedIds.find(currId => currId === id)) throw new Error('Item NOT added - in cart already.');
  try {
    const fetchId = await fetch(url);
    const object = await fetchId.json();
    if (object.error) throw new Error(object.error);
    const cartList = document.querySelector('ol.cart__items');
    const cartItem = createCartItemElement(object);
    cartList.appendChild(cartItem);
    manageCartInStorage('add', id);
    sumCart();
  } catch (error) {
    throw new Error(error);
  }
  return 'Item added.';
}

function itemClickListener(event) {
  const itemSku = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${itemSku}`;
  addToCart(url, itemSku)
    .catch(error => console.log(error));
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', itemClickListener);
  section.appendChild(button);

  return section;
}

function loadStoredCart(storedCartItems) {
  const fetchPromises = [];
  storedCartItems.forEach((item) => {
    const url = `https://api.mercadolibre.com/items/${item}`;
    fetchPromises.push(fetch(url)
      .then(objectJson => objectJson.json())
      .catch(error => console.log(error)),
    );
  });

  Promise.all(fetchPromises)
    .then((promises) => {
      promises.forEach((item) => {
        const cartList = document.querySelector('ol.cart__items');
        const cartItem = createCartItemElement(item);
        cartList.appendChild(cartItem);
        sumCart();
      });
    })
    .catch(error => console.log(error));
}

function clearCart() {
  const pricePlacer = document.querySelector('.price .total-price');
  const cartList = document.querySelector('ol.cart__items');
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
  pricePlacer.innerText = '-';
  storedIds = [];
  localStorage.removeItem('myCartIds');
}

function loaderElement() {
  const itemSection = document.querySelector('section.items');
  const div = document.createElement('div');
  div.className = 'loading';
  div.innerHTML = 'loading...<br><img src="loading.gif">';
  itemSection.appendChild(div);
}

window.onload = function onload() {
  loaderElement();
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
    .then(jsonReceived => jsonReceived.json())
    .then((object) => {
      const itemSection = document.querySelector('section.items');
      setTimeout(() => {
        const divLoading = document.querySelector('.loading');
        divLoading.remove();
        object.results.forEach((queryItem) => {
          itemSection.appendChild(createProductItemElement(queryItem));
        });
      },
      2000);
    })
    .catch('deu pau no carregamento dos produtos!');

  storedIds = localStorage.getItem('myCartIds');
  if (storedIds) {
    storedIds = storedIds.split(',');
    loadStoredCart(storedIds);
  }

  const clearCartButton = document.querySelector('button.empty-cart');
  clearCartButton.addEventListener('click', clearCart);
};
