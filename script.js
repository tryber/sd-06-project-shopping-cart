const apiUrl = 'https://api.mercadolibre.com/';
const apiUrlSearch = 'sites/MLB/search?q=$computador';
const apiUrlItemCart = 'items/';

const changeLocalStorage = () => {
  const completeList = document.querySelector('.cart__items').innerHTML;
  localStorage.clear();
  localStorage.setItem('Lista de todos os elementos', completeList);
};

let save = 0;
const sumTotalPrice = (salePrice) => {
  save += salePrice;
  return save;
};

const subtractionTotalPrice = (salePrice) => {
  save -= salePrice;
  return save;
};

async function sumAsyncAwait(salePrice) {
  const priceContainer = document.querySelector('.container');
  const showPrice = document.querySelector('.total-price');
  await sumTotalPrice(salePrice);
  showPrice.innerHTML = `${save}`;
  priceContainer.appendChild(showPrice);
};

async function subtractionAsyncAwait() {
  const priceContainer = document.querySelector('.container');
  const showPrice = document.querySelector('.total-price');
  const priceToRemove = event.target.innerHTML.split('PRICE: $')[1];
  await subtractionTotalPrice(priceToRemove);
  showPrice.innerHTML = `${save}`;
  priceContainer.appendChild(showPrice);
};

function cartItemClickListener(event) {
  const itemDelete = event.target;
  itemDelete.parentNode.removeChild(itemDelete);
  changeLocalStorage();
  subtractionAsyncAwait();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const listOfElement = document.querySelector('.cart__items');
  listOfElement.appendChild(li);
  changeLocalStorage();
  sumAsyncAwait(salePrice);
}

const creatObjectFunction = (element, callback) => {
  const objectOfElement = {
    sku: element.id,
    name: element.title,
    image: element.thumbnail,
    salePrice: element.price,
  };

  callback(objectOfElement);
};

const searchHandler = (id) => {
  const url = `${apiUrl}${apiUrlItemCart}${id}`;
  fetch(url)
    .then(response => response.json())
    .then(element => creatObjectFunction(element, createCartItemElement));
};

const buttonHandler = () => {
  const element = event.path[1];
  const id = element.firstElementChild.innerText;
  searchHandler(id);
};

const toPlaceFunction = (section) => {
  const placeToPlace = document.querySelector('.items');
  placeToPlace.appendChild(section);
};

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
  const buttonAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAdd.addEventListener('click', buttonHandler);
  section.appendChild(buttonAdd);
  toPlaceFunction(section);
}

const handleResults = (results) => {
  results.forEach((elementDoArray) => {
    creatObjectFunction(elementDoArray, createProductItemElement);
  });
};

const messageLoading = () => {
  const conteiner = document.querySelector('.cart');
  const message = document.createElement('span');
  message.classList = 'loading';
  message.innerText = 'loading...';
  conteiner.appendChild(message);
};

const messageLoadingRemove = () => {
  setTimeout(() => {
    const conteiner = document.querySelector('.cart');
    const message = document.querySelector('.loading');
    conteiner.removeChild(message);
  }, 1000);
};

const apiHandlers = (url) => {
  messageLoading();
  fetch(url)
    .then(response => response.json())
    .then(object => handleResults(object.results))
    .then(messageLoadingRemove());
};

const buttonDeleteFunction = () => {
  const completeList = document.querySelector('.cart__items');
  completeList.innerHTML = ' ';
  localStorage.clear();
};

const loadLocalStorag = () => {
  const storage = localStorage.getItem('Lista de todos os elementos');
  document.querySelector('.cart__items').innerHTML = storage;
};

window.onload = function onload() {
  apiHandlers(`${apiUrl}${apiUrlSearch}`);
  loadLocalStorag();
  const buttonDelete = document.querySelector('.empty-cart');
  buttonDelete.addEventListener('click', buttonDeleteFunction);
  sumAsyncAwait(0);
};
