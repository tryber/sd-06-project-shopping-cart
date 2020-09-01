function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cleanCart(event) {
  localStorage.clear();
  while (document.querySelector('.cart__items').childNodes.length > 0) {
    document.querySelector('.cart__items')
    .removeChild(document.querySelector('.cart__items').childNodes[0]);
  }
  document.querySelector('div').innerText = 'Preço total: $0';
}

async function totalPrice(price) {
  let total = parseInt(localStorage.getItem('total'), 10);
  total += price;
  const totalText = document.querySelector('div');
  totalText.innerHTML = `Preço total: ${total}`;
}

function saveLocalStorage({ id, price, title }) {
  if (localStorage.length === 0 || localStorage.cart === '') {
    localStorage.setItem('cart', `${id}, ${title}, ${price}`);
    localStorage.setItem('total', `${price}`);
  } else {
    const items = localStorage.getItem('cart');
    let total = parseInt(localStorage.getItem('total'), 10);
    total += price;
    localStorage.setItem('cart', `${items}, ${id}, ${title}, ${price}`);
    localStorage.setItem('total', `${total}`);
  }
}

function removeFromStorage(element) {
  const text = element.innerText.split('|');
  const idSku = text[0].split(':')[1];
  const itemsArray = localStorage.getItem('cart').split(',');
  for (let item = 0; item < itemsArray.length; item += 3) {
    if (itemsArray[item].trim() === idSku.trim()) {
      itemsArray.splice(itemsArray.indexOf(itemsArray[item]), 3);
      localStorage.setItem('cart', itemsArray);
      break;
    }
  }
}

function removeFromPrices(element) {
  const text = element.innerText.split('|');
  const singlePrice = parseInt(text[2].split(':')[1].trim().slice(1), 10);
  let total = parseInt(localStorage.getItem('total'), 10);
  total -= singlePrice;
  document.querySelector('div').innerText = `Preço total: ${total}`;
  localStorage.setItem('total', `${total}`);
}

function checkStorage(element) {
  if (localStorage.cart.split(',').length === 3) {
    localStorage.clear();
    document.querySelector('div').innerText = 'Preço total: $0';
  } else {
    removeFromStorage(element);
    removeFromPrices(element);
  }
}

function cartItemClickListener(event) {
  const element = event.target;
  checkStorage(element);
  document.querySelector('.cart__items').removeChild(element);
}

function renderShoppingCart() {
  if (localStorage.cart !== '' && localStorage.length !== 0) {
    const itemsArray = localStorage.getItem('cart').split(',');
    for (let item = 0; item < itemsArray.length; item += 3) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = `SKU: ${itemsArray[item].trim()} | NAME: ${itemsArray[item + 1]
        .trim()} | PRICE: $${itemsArray[item + 2].trim()}`;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('.cart__items').appendChild(li);
    }
    let total = parseInt(localStorage.getItem('total'), 10);
    document.querySelector('div').innerText = `Preço total: ${total}`;
  }
}

function fetchSingleItem(event) {
  const idSku = event.target.parentElement.childNodes[0].innerText;
  return fetch(`https://api.mercadolibre.com/items/${idSku}`)
    .then(response => response.json())
    .then(({ id, title, price }) => ({ id, title, price }));
}

async function createCartItemElement(event) {
  const { id, price, title } = await fetchSingleItem(event);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  saveLocalStorage({ id, price, title });
  document.querySelector('.cart__items').appendChild(li);
  totalPrice(price);
  return li;
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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', createCartItemElement);
  section.appendChild(button);
  document.querySelector('.items').appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function transformObject({ id, title, price, thumbnail }) {
  newObject = {};
  newObject.sku = id;
  newObject.name = title;
  newObject.salePrice = price;
  newObject.image = thumbnail;
  return newObject;
}

function fetchItems(query = 'computador') {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then(response => response.json())
    .then(response => response.results)
    .then(response => response.map((e) => {
      const TransformedObj = transformObject(e);
      createProductItemElement(TransformedObj);
      return TransformedObj;
    }));
}

window.onload = function onload() {
  fetchItems();
  renderShoppingCart();
  document.querySelector('.empty-cart').addEventListener('click', cleanCart);
};
