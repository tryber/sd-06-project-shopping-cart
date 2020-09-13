

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  const remove = document.querySelector('.cart__items')
  remove.removeChild(event.target);
  console.log(event.target)
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function apendItem(resultItemElement) {
  document.querySelector('.items').appendChild(resultItemElement);
  resultItemElement.addEventListener('click', (event) => {
    const fechsku = event.currentTarget.firstChild.innerText;
    fetchProductItem(fechsku);
  })
}

async function fetchItens(url, endpoint) {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const item = await response.json();
  item.results.forEach(resultItem => apendItem(createProductItemElement(resultItem)));
}

function addCar(addCarItem) {
  const car = document.querySelector('.cart__items');
  car.appendChild(addCarItem);
}

async function fetchProductItem(sku) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const item = await response.json();
  const productObject = createCartItemElement(item);
  addCar(productObject);
}

window.onload = function onload() {
  fetchItens();
};
