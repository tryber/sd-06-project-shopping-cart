/* eslint-disable arrow-parens */
window.onload = function onload() {

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const apiQuery = 'computador';
const apiList = `https://api.mercadolibre.com/sites/MLB/search?q=$${apiQuery}`;

function createItem(listItem) {
  const newItem = {};
  newItem.sku = listItem.id;
  newItem.name = listItem.title;
  newItem.salePrice = listItem.price;
  newItem.image = listItem.thumbnail;
  return newItem;
}

function addItemToCart(eventElement) {
  const selectedItem = eventElement.parentNode;
  const itemID = getSkuFromProductItem(selectedItem);
  const apiItem = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(apiItem).then(response => response.json())
    .then(data => {
      const fetchedItem = createItem(data);
      const newCartItem = createCartItemElement(fetchedItem);
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(newCartItem);
    });
}

async function createItemList() {
  await fetch(apiList).then(response => response.json())
    .then(data => data.results
      .forEach((computer) => {
        const productItemObject = createItem(computer);
        const newListItem = createProductItemElement(productItemObject);
        const itemList = document.querySelector('.items');
        itemList.appendChild(newListItem);
      }))
    .then(() => {
      const addButton = document.querySelector('.items');
      addButton.addEventListener('click', () => {
        const button = event.target;
        addItemToCart(button);
      });
    });
}

createItemList();
