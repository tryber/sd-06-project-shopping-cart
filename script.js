// requisito #4
function localStorageSave() {
  const itemToStorage = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('item', itemToStorage);
}

// requisitos #3
function cartItemClickListener(event) {
  const selectItem = event.target;
  selectItem.remove();
  localStorageSave();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito #2
const ShowCartItem = ({ id, title, price }) => {
  let cartObject = {};
  cartObject = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const productToCart = createCartItemElement(cartObject);
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(productToCart);
  localStorageSave();
};

const fetchById = (id) => {
  const endpointById = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpointById)
  .then(response => response.json())
    .then((computer) => {
      ShowCartItem(computer);
    });
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', function (event) {
      const itemID = event.target.parentElement.firstChild.innerText;
      fetchById(itemID);
    });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// requisito #1
const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search',
};

const url = `${apiInfo.api}${apiInfo.endpoint}`;
const endpoint = `${url}?q=computador`;

const showAllResults = (computersArray) => {
  let objectToShow = {};
  computersArray.forEach((computador) => {
    objectToShow = {
      sku: computador.id,
      name: computador.title,
      image: computador.thumbnail,
    };
    const productItem = createProductItemElement(objectToShow);
    const sectionToShow = document.querySelector('.items');
    sectionToShow.appendChild(productItem);
  });
};

const fetchComputers = () => {
  fetch(endpoint)
  .then(response => response.json())
    .then((computers) => {
      showAllResults(computers.results);
    });
};

// requisito #4
function listenToRetrievedItem(itemsArray) {
  itemsArray.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function retrieveLocalStorage() {
  const retrievedItem = localStorage.getItem('item');
  const retrievedCart = document.querySelector('.cart__items');
  retrievedCart.innerHTML = retrievedItem;
  const CartItems = document.querySelectorAll('.cart__item');
  console.log(CartItems);
  listenToRetrievedItem(CartItems);
}

window.onload = function onload() {
  fetchComputers();

  if (localStorage.getItem('item')) {
    retrieveLocalStorage();
  }
};
