const myApi = 'https://api.mercadolibre.com';

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const updateLocalStorage = () => {
  const myItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('myList', myItems);
  console.log(localStorage.getItem('myList'));
};

const updateItemsByLocalStorage = () => {
  const cartItens = document.querySelector('.cart__items');
  cartItens.innerHTML = localStorage.getItem('myList');
};

const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (e) => {
  e.target.remove();
  updateLocalStorage();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: ${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProductById = (id) => {
  const endPoint = `${myApi}/items/${id}`;
  fetch(endPoint)
    .then(response => response.json())
    .then((object) => {
      const myProduct = { sku: object.id, name: object.title, salePrice: object.price };
      const cartItens = document.querySelector('.cart__items');
      cartItens.appendChild(createCartItemElement(myProduct));
      updateLocalStorage();
    });
};

const addCart = (e) => {
  const itemParent = (e.target).parentElement;
  const id = getSkuFromProductItem(itemParent);
  fetchProductById(id);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addCart);
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const showProducts = (results) => {
  const itemProduct = document.querySelector('.items');
  results.forEach((result) => {
    const myObject = { sku: result.id, name: result.title, image: result.thumbnail };
    itemProduct.appendChild(createProductItemElement(myObject));
  });
};

const fetchProducts = () => {
  const endPoint = `${myApi}/sites/MLB/search?q=$computadores`;
  fetch(endPoint)
    .then(response => response.json())
    .then((object) => {
      showProducts(object.results);
    });
};

const clearItems = () => {
  const myList = document.querySelector('.cart__items');
  myList.innerHTML = '';
  updateLocalStorage();
};

window.onload = function onload() {
  fetchProducts();
  updateItemsByLocalStorage();
  document.querySelector('.empty-cart').addEventListener('click', clearItems);
};
