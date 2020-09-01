const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function addToCart(productID) {
  const cart = document.querySelector('.cart__items');

  fetch(`https://api.mercadolibre.com/items/${productID}`)
    .then(response => response.json())
    .then((response) => {
      const productToCart = createCartItemElement(response);
      cart.appendChild(productToCart);
    });
}

function cartItemClickListener(event) {
  const buttonItem = event.querySelector('.item__add');
  const itemID = getSkuFromProductItem(event);

  buttonItem.addEventListener('click', function () { addToCart(itemID); });
}

function fetchComputers() {
  const section = document.querySelector('.items');

  fetch(url)
    .then(response => response.json())
    .then(response => response.results)
    .then(arrayOfComputers => arrayOfComputers.forEach((computer) => {
      const product = createProductItemElement(computer);
      cartItemClickListener(product);
      section.appendChild(product);
    }));
}

window.onload = function onload() {
  fetchComputers();
};
