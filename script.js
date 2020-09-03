window.onload = function onload() { };

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

function upStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.loadCart = cartItems;
}

function cartItemClickListener(event) {
  event.target.remove();
  upStorage();
}

function loadStorage() {
  if (localStorage.loadCart) {
    document.querySelector('.cart__items').innerHTML = localStorage.loadCart;
    cartItemClickListener();
  }
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('button').addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json())
    .then((data) => {
      const { id, title, price } = data;
      const addItem = createCartItemElement({ id, title, price });
      document.querySelector('.cart__items').appendChild(addItem);
      upStorage();
    });
  });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }


window.onload = () => {
  const itemCart = document.querySelector('.items');
  const urlApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(urlApi)
  .then(res => res.json())
  .then((data) => {
    data.results.forEach((elemento) => {
      itemCart.appendChild(createProductItemElement(elemento));
    });
  });
  loadStorage();
};
