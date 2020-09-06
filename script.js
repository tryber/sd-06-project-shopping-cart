function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function updateTotalPrice(addOrRemove, price) {
  let currentValue = parseFloat(document.querySelector('.total-price').innerHTML);
  if (addOrRemove === 'add') currentValue += price;
  if (addOrRemove === 'remove') currentValue -= price;
  document.querySelector('.total-price').innerHTML = currentValue;
}

function updateLocalStorage() {
  localStorage.cartShop = document.querySelector('.cart__items').innerHTML;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  const price = parseFloat(event.target.innerHTML.split('PRICE: $')[1]);
  ol.removeChild(event.target);
  updateTotalPrice('remove', price);
  updateLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartShop(data) {
  const sku = data.id;
  const name = data.title;
  const salePrice = data.price;
  const li = createCartItemElement({ sku, name, salePrice });
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  updateTotalPrice('add', salePrice);
  updateLocalStorage();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchItem(itemId) {
  const urlAPIItem = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(urlAPIItem)
  .then(response => response.json())
  .then(data => addCartShop(data))
  .catch(error => window.alert(error));
}

function eventClickBt(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  fetchItem(itemId);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') e.addEventListener('click', eventClickBt);
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

function listElements(arrResults) {
  const secItems = document.querySelector('.items');
  const span = document.querySelector('.loading');
  secItems.removeChild(span);

  arrResults.forEach((product) => {
    const sku = product.id;
    const name = product.title;
    const image = product.thumbnail;
    secItems.appendChild(createProductItemElement({ sku, name, image }));
  });
}

const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function fetchMLB(url) {
  fetch(url)
  .then(response => response.json())
  .then(data => listElements(data.results))
  .catch(error => window.alert(error));
}

function getLocalStorageInfo() {
  if (localStorage.getItem('cartShop') !== null) {
    const cart = document.querySelector('.cart__items');
    cart.innerHTML = localStorage.cartShop;
    cart.childNodes.forEach((element) => {
      element.addEventListener('click', cartItemClickListener);
      const price = parseFloat(element.innerHTML.split('PRICE: $')[1]);
      updateTotalPrice('add', price);
    });
  }
}

function btCleaner() {
  const btClean = document.querySelector('.empty-cart');
  btClean.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.setItem('cartShop', '');
    document.querySelector('.total-price').innerHTML = 0;
  });
}

window.onload = () => {
  getLocalStorageInfo();
  fetchMLB(urlAPI);
  btCleaner();
};
