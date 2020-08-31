function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  console.log(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartShop(data) {
  const li = createCartItemElement({ sku: data.id, name: data.title, salePrice: data.price });
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
}

function fetchItem(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const urlAPIItem = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(urlAPIItem)
    .then(response => response.json())
    .then(data => addCartShop(data));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') e.addEventListener('click', fetchItem);
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
  arrResults.forEach((product) => {
    const sku = product.id;
    const name = product.title;
    const image = product.thumbnail;
    const secItems = document.querySelector('.items');
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

window.onload = () => fetchMLB(urlAPI);
