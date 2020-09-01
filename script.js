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
        sum += parseFloat(item.price);
      });
      pricePlacer.innerText = sum.toFixed(2);
    } else {
      pricePlacer.innerText = '-';
    }
  } catch (error) {
    throw new Error('Ocorreu um erro no cálculo do valor de seu carrinho.');
  }
}

let myCartArray = [];

function cartItemClickListener(event) {
  const indexOfItem = myCartArray.indexOf(event.target.id);
  if (indexOfItem > -1) myCartArray.splice(indexOfItem, 1);
  event.target.remove();
  sumCart()
    .catch(error => console.log(error));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.price = salePrice;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemInCart(url) {
  fetch(url)
    .then(jsonReceived => jsonReceived.json())
    .then((object) => {
      const cartList = document.querySelector('ol.cart__items');
      cartList.appendChild(createCartItemElement(object));
      myCartArray.push(object.id);
      sumCart()
        .catch(error => console.log(error));
    })
    .catch('deu pau no add pro carrinho!');
}

function itemClickListener(event) {
  const itemSku = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${itemSku}`;
  addItemInCart(url);
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

function loadStoredCart(array) {
  array.forEach((id) => {
    const url = `https://api.mercadolibre.com/items/${id}`;
    addItemInCart(url);
  });
}

function clearCart() {
  const pricePlacer = document.querySelector('.price .total-price');
  const cartList = document.querySelector('ol.cart__items');
  cartList.innerHTML = '';
  pricePlacer.innerText = '-';
  myCartArray = [];
  localStorage.removeItem('myCart');
}

function loaderElement() {
  const itemSection = document.querySelector('section.items');
  const div = document.createElement('div');
  div.className = 'loading';
  div.innerHTML = 'loading...<br><img src="loading.gif">';
  itemSection.appendChild(div);
}

window.onload = function onload() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  loaderElement();
  fetch(url)
    .then(jsonReceived => jsonReceived.json())
    .then((object) => {
      const itemSection = document.querySelector('section.items');
      setTimeout(() => {
        itemSection.innerHTML = '';
        object.results.forEach((queryItem) => {
          itemSection.appendChild(createProductItemElement(queryItem));
        });
      },
      2000);
    })
    .catch('deu pau!');

  const storedCart = localStorage.getItem('myCart');
  if (storedCart) {
    tempArray = storedCart.split(',');
    loadStoredCart(tempArray);
  }

  const clearCartButton = document.querySelector('button.empty-cart');
  clearCartButton.addEventListener('click', clearCart);
};

window.addEventListener('beforeunload', () => {
  localStorage.removeItem('myCart');
  localStorage.setItem('myCart', myCartArray);
});
