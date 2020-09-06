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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart(item) {
  const myCart = document.querySelector('.cart__items');
  myCart.appendChild(item);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', (event) => {
    // console.log('hello');
    const itemID = event.currentTarget.parentElement.firstChild.innerText;
    // console.log(itemID);
    fetchSpecificMLItem(itemID);
  });

  return section;
}

const fetchSpecificMLItem = (id) => {
  const specificMLItemEndpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(specificMLItemEndpoint)
    .then(response => response.json())
    .then(object => addItemToCart(createCartItemElement(object)));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchMLComputers() {
  const MLComputerEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(MLComputerEndpoint)
    .then(response => response.json())
    .then(object => object.results.forEach(product =>
      document.querySelector('.items')
      .appendChild(createProductItemElement(product))));
}
// fetchSpecificMLItem('MLB1341706310');

window.onload = function onload() {
  fetchMLComputers();
};
