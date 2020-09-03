window.onload = function onload() { };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function savetToStorageCart() {
  const olList = document.querySelector('.cart__items');
  window.localStorage.setItem('car_list', olList.innerHTML);
}

function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  savetToStorageCart();
}

function storageList() {
  const olList = document.querySelector('.cart__items');
  olList.innerHTML = window.localStorage.getItem('car_list');
  const liList = document.querySelectorAll('li');
  liList.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.price = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getInTheCarList(event) {
  const idCardTarget = event.target.previousSibling.previousSibling.previousSibling.innerText;
  const url = `https://api.mercadolibre.com/items/${idCardTarget}`;
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      const addCpuCar = document.querySelector('.cart__items');
      addCpuCar.appendChild(createCartItemElement(data));
      storageCar();
    });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const urlInclude = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((cpu) => {
      const myItems = document.querySelector('.items');
      const pcs = createProductItemElement(cpu);
      myItems.appendChild(pcs);
    });
  });
};

const removeAlItems = () => {
  const listCar = document.querySelector('.cart__items');
  listCar.innerHTML = '';
  storageCar();
};

window.onload = function onload() {
  urlInclude();
  storageList();
  const btnRemoveAllItems = document.querySelector('.empty-cart');
  btnRemoveAllItems.addEventListener('click', removeAlItems);
};
