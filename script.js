const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

function addLocalItem() {
  const buyToLocal = document.querySelector('.cart__items').innerHTML;
  console.log(buyToLocal);
  localStorage.setItem('computerLocalStorage', buyToLocal);
}

function loadStorageList() {
  if (localStorage.computerLocalStorage) {
    const loadOl = document.querySelector('.cart__items');
    loadOl.innerHTML = localStorage.getItem('computerLocalStorage');
  }
}

// async function fetchComputer (endpoint) {
//   const response = await fetch(endpoint);
//   const object = await response.json();

//   const data = {
//     sku: object.result.id,

//   }

//   createProductItemElement(object.result);
// }

// addLocalItem(JSON.stringify({
//   sku: object.id,
//   name: object.title,
//   salePrice: object.price,

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

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonId = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonId.addEventListener('click', () => fetchBuyedComputer(sku));
  section.appendChild(buttonId);
  return section;
}

// JSON.parse()  ---> to json


// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const removeItem = document.querySelector('.cart__items');
  removeItem.removeChild(event.target);
}

// let a = (JSON.parse(localStorage[0]));
// console.log(a.sku);

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchComputer() {
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((computer) => {
        const fatherElement = document.querySelector('.items');
        fatherElement.appendChild(createProductItemElement(computer));
      });
    });
}

function fetchBuyedComputer(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((object) => {
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement({
        sku: object.id,
        name: object.title,
        salePrice: object.price,
      }));
      addLocalItem();
    });
}

window.onload = function onload() {
  fetchComputer();
  loadStorageList();
};
