function saveCurrentList() {
  const cartList = document.querySelector('.cart__items');
  const listSaver = cartList.innerHTML;
  localStorage.setItem('SavedList', listSaver);
}

function cartItemClickListener(event, cartList) {
  cartList.removeChild(event);
  saveCurrentList();
}

window.onload = function onload() {
  const cartList = document.querySelector('.cart__items');
  cartList.addEventListener('click', () => {
    cartItemClickListener(event.target, cartList);
  });

  function cartItensHandler() {
    const savedList = localStorage.getItem('SavedList');
    if (savedList) {
      cartList.innerHTML = savedList;
    }
  }

  cartItensHandler();
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

function itemCreator(item, createFunction, listClassName) {
  const fetchedItemData = createItem(item);
  const newItem = createFunction(fetchedItemData);
  const itemList = document.querySelector(listClassName);
  itemList.appendChild(newItem);
  if (createFunction === createCartItemElement) {
    saveCurrentList();
  }
}

function addItemToCart(eventElement) {
  if (eventElement.className === 'item__add') {
    const selectedItem = eventElement.parentNode;
    const itemID = getSkuFromProductItem(selectedItem);
    const apiItem = `https://api.mercadolibre.com/items/${itemID}`;
    fetch(apiItem).then(response => response.json())
      .then((data) => {
        itemCreator(data, createCartItemElement, '.cart__items');
      });
  }
}

async function createItemList() {
  await fetch(apiList).then(response => response.json())
    .then(data => data.results
      .forEach((computer) => {
        itemCreator(computer, createProductItemElement, '.items');
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
