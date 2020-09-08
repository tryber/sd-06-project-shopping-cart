
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function addPrices(price) {
  const allPrices = document.querySelector('.total-price');
  allPrices.innerHTML = parseFloat(allPrices.innerHTML) + price;
}

function removePrice(event) {
  let eventValue = event.target.innerHTML;
  eventValue = parseFloat(eventValue.substring(eventValue.indexOf('$') + 1));
  addPrices(-eventValue);
}

function storageCart() {
  const olList = document.querySelector('.cart__items');
  window.localStorage.setItem('car_list', olList.innerHTML);
  const allValueCar = document.querySelector('.total-price');
  localStorage.setItem('car_list_value', allValueCar.innerHTML);
}

function cartItemClickListener(event) {
  const carList = document.querySelector('.cart__items');
  carList.removeChild(event.target);
  removePrice(event);
  storageCart();
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
      storageCart();
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

const removeAlItems = () => {
  const listCar = document.querySelector('.cart__items');
  listCar.innerHTML = '';
  document.querySelector('.total-price').innerHTML = 0;
  storageCar();
};

window.onload = function onload() {
  urlInclude();
  storageList();
  const btnRemoveAllItems = document.querySelector('.empty-cart');
  btnRemoveAllItems.addEventListener('click', removeAlItems);
};
