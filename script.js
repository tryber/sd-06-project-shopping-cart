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

function parentCart(element) {
  const parentClass = document.querySelector('.cart__items');
  parentClass.appendChild(element);
}

function retrieveButtonData(button) {
  const itemsDetails = button.parentElement;
  return itemsDetails;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createObjectToCart(data) {
  const response = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  return response;
}

function cartItemClickListener(event) {
  const itemClicked = event.target;
  itemClicked.id = 'clicked';
  const itemToRemove = document.querySelector('#clicked');
  itemToRemove.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function removeLoading() {
  const removeLoad = document.querySelector('.loading');
  removeLoad.remove();
}

async function sendToCart(sku) {
  const fetchToCart = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const jsonCart = await fetchToCart.json();
  await removeLoading();
  const dataToCart = createObjectToCart(jsonCart);
  const cartFunc = createCartItemElement(dataToCart);
  parentCart(cartFunc);
}

function parentLoad(loadingElement) {
  const parentClass = document.querySelector('ol');
  parentClass.appendChild(loadingElement);
}

function apiLoading() {
  const loadingElement = document.createElement('p');
  loadingElement.className = 'loading';
  loadingElement.innerText = 'loading...';
  parentLoad(loadingElement);
}

function buttonClick(event) {
  const clickedButton = event.target;
  const buttonDetails = retrieveButtonData(clickedButton);
  const buttonSku = getSkuFromProductItem(buttonDetails);
  sendToCart(buttonSku);
  apiLoading();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', buttonClick);

  return section;
}

function parentList(element) {
  const parentClass = document.querySelector('.items');
  parentClass.appendChild(element);
}

async function fetchProducts() {
  const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await result.json();
  const itemsArray = json.results;
  itemsArray.forEach((item) => {
    const data = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    const newItems = createProductItemElement(data);
    parentList(newItems);
  });
}

function clearAll() {
  const cartList = document.querySelector('ol');
  cartList.innerHTML = '';
}

window.onload = function onload() {
  fetchProducts();
  const clearAllButton = document.querySelector('.empty-cart');
  clearAllButton.addEventListener('click', clearAll);
};
