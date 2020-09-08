

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

function addPrices(price) {
  const allPrices = document.querySelector('.total-price');
  allPrices.innerHTML = parseFloat(allPrices.innerHTML) + price;
}

const removeCartElements = () => {
  const cartList = document.querySelector('.cart__items');
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
};

const removeCartTotalPriceElement = () => {
  const totalPriceElement = document.querySelector('.total-price');
  if (totalPriceElement) {
    totalPriceElement.parentElement.removeChild(totalPriceElement);
  }
};

const clearCart = () => {
  removeCartElements();
  localStorage.clear();
  removeCartTotalPriceElement();
};

const ClickAndClear = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', (e) => {
    clearCart(e);
  });
};

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
  addPrices(salePrice);
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
  const customE = document.createElement(element);
  customE.className = className;
  customE.innerText = innerText;
  return customE;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddCar = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCar.addEventListener('click', getInTheCarList);
  section.appendChild(btnAddCar);
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


window.onload = function onload() {
  urlInclude();
  storageList();
  ClickAndClear();
};
