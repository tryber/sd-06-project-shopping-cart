function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cleanCart(event) {
  localStorage.clear();
  while (document.querySelector('.cart__items').childNodes.length > 0) {
    document.querySelector('.cart__items')
      .removeChild(document.querySelector('.cart__items').childNodes[0]);
  }
  document.querySelector('div').innerText = '$0';
}

const renderPrice = (price) => {
  const text = document.querySelector('.total-price');
  if (price) {
    text.innerText = price;
  } else {
    const prices = JSON.parse(localStorage.prices);
    text.innerText = prices.reduce((acc, cur) => (acc += cur), 0);
  }
};

function createLocalStorage({ id, price, title }) {
  const itemsArray = [];
  itemsArray.push({ id, price, title });
  localStorage.setItem('cart', JSON.stringify(itemsArray));

  const pricesArray = [];
  pricesArray.push(price);
  localStorage.setItem('prices', JSON.stringify(pricesArray));
  renderPrice(`${price}`);
}

function alterLocalStoradeCart({ id, price, title }) {
  const items = JSON.parse(localStorage.cart);
  items.push({ id, price, title });
  localStorage.setItem('cart', JSON.stringify(items));
}

function alterLocalStoradePrices(price) {
  const prices = JSON.parse(localStorage.prices);
  prices.push(price);
  localStorage.setItem('prices', JSON.stringify(prices));
  renderPrice();
}

function checkLocalStorageState({ id, price, title }) {
  if (!localStorage.cart) {
    createLocalStorage({ id, price, title });
  } else {
    alterLocalStoradeCart({ id, price, title });
    alterLocalStoradePrices(price);
  }
}

function removeElementFromSerie(comparator, serie) {
  const index = serie.findIndex(e => e === comparator);
  serie.splice(index, 1);
  return serie;
}

function removeFromStorage(element) {
  const text = element.innerText.split('|');
  const idSku = text[0].split(':')[1];
  const itemsArray = JSON.parse(localStorage.getItem('cart'));
  const newSerie = removeElementFromSerie(idSku, itemsArray);
  localStorage.setItem('cart', JSON.stringify(newSerie));
}

function removeFromPrices(element) {
  const singlePrice = parseFloat(element.innerText.split('$')[1]);
  const prices = JSON.parse(localStorage.getItem('prices'));
  const newSerie = removeElementFromSerie(singlePrice, prices);
  localStorage.setItem('prices', JSON.stringify(newSerie));
  renderPrice();
}

function checkStorage(element) {
  if (JSON.parse(localStorage.getItem('cart')).length === 1) {
    localStorage.clear();
    document.querySelector('div').innerText = '$0';
  } else {
    removeFromStorage(element);
    removeFromPrices(element);
  }
}

function cartItemClickListener(event) {
  const element = event.target;
  checkStorage(element);
  document.querySelector('.cart__items').removeChild(element);
}

function renderShoppingCart() {
  if (localStorage.length !== 0) {
    const itemsArray = JSON.parse(localStorage.getItem('cart'));
    itemsArray.forEach((e) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = `SKU: ${e.id} | NAME: ${e.title} | PRICE: $${e.price}`;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('.cart__items').appendChild(li);
    });
    renderPrice();
  }
}

function fetchSingleItem(event) {
  const idSku = event.target.parentElement.childNodes[0].innerText;
  return fetch(`https://api.mercadolibre.com/items/${idSku}`)
    .then(response => response.json())
    .then(({ id, title, price }) => ({ id, title, price }));
}

async function createCartItemElement(event) {
  const { id, price, title } = await fetchSingleItem(event);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  checkLocalStorageState({ id, price, title });
  document.querySelector('.cart__items').appendChild(li);
  return li;
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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', createCartItemElement);
  section.appendChild(button);
  document.querySelector('.items').appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function transformObject({ id, title, price, thumbnail }) {
  newObject = {};
  newObject.sku = id;
  newObject.name = title;
  newObject.salePrice = price;
  newObject.image = thumbnail;
  return newObject;
}

function fetchItems(query = 'computador') {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then(response => response.json())
    .then(response => response.results)
    .then(response => response.map((e) => {
      const TransformedObj = transformObject(e);
      createProductItemElement(TransformedObj);
      return TransformedObj;
    }));
}

window.onload = function onload() {
  fetchItems();
  renderShoppingCart();
  document.querySelector('.empty-cart').addEventListener('click', cleanCart);
};
