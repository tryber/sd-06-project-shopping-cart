const apiUrl = 'https://api.mercadolibre.com/';
const apiUrlSearch = 'sites/MLB/search?q=$computador';
const apiUrlItemCart = 'items/';

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

function cartItemClickListener(event) {
  const itemDelete = event.target;
  itemDelete.parentNode.removeChild(itemDelete);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const listOfElement = document.querySelector('.cart__items');
  listOfElement.appendChild(li);
}

const placeToPlaceFunction = (section) => {
  const placeToPlace = document.querySelector('.items');
  placeToPlace.appendChild(section);
};

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAdd.addEventListener('click', buttonHandler);
  section.appendChild(buttonAdd);
  placeToPlaceFunction(section);
}

//  function getSkuFromProductItem(item) {
//    return item.querySelector('span.item__sku').innerText;
//  }

const handleResults = (results) => {
  results.forEach((elementDoArray) => {
    creatObjectFunction(elementDoArray, createProductItemElement);
  });
};

const apiHandlers = (url) => {
  fetch(url)
    .then(response => response.json())
    .then(object => handleResults(object.results));
};

//  const buttonDelete = document.querySelector('.empty-cart');

window.onload = function onload() {
  apiHandlers(`${apiUrl}${apiUrlSearch}`);
};
