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

function parentLoad(loadingElement) {
  const parentClass = document.querySelector('.container');
  parentClass.appendChild(loadingElement);
}

function apiLoading() {
  const loadingElement = document.createElement('span');
  loadingElement.className = 'loading';
  loadingElement.innerText = 'loading...';
  parentLoad(loadingElement);
}

function removeLoading() {
  const removeLoad = document.querySelector('.loading');
  console.log(removeLoad);
  removeLoad.remove();
}

function sendToCart(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json())
    .then(jsonCart => createObjectToCart(jsonCart))
    .then(dataToCart => createCartItemElement(dataToCart))
    .then(cartFunc => parentCart(cartFunc));
}

function buttonClick(event) {
  const clickedButton = event.target;
  const buttonDetails = retrieveButtonData(clickedButton);
  const buttonSku = getSkuFromProductItem(buttonDetails);
  sendToCart(buttonSku);
}

function parentList(element) {
  const parentClass = document.querySelector('.items');
  parentClass.appendChild(element);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', buttonClick);

  return parentList(section);
}

function fetchProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => {
      removeLoading();
      return result.json();
    })
    .then(itemsArray => itemsArray.results)
    .then((data) => {
      data.forEach((item) => {
        const object = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        createProductItemElement(object);
      });
    });
}

function clearAll() {
  const cartList = document.querySelector('ol');
  cartList.innerHTML = '';
}

window.onload = function onload() {
  apiLoading();
  fetchProducts();
  const clearAllButton = document.querySelector('.empty-cart');
  clearAllButton.addEventListener('click', clearAll);
};
