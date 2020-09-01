
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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const fatherQuery = document.querySelector('.items');
  return fatherQuery.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.path[1].removeChild(event.path[0]);
}

const clearCart = () => {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  }
)};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const URL = 'https://api.mercadolibre.com/';
const idUrl = 'https://api.mercadolibre.com/items/';

const addCart = (id) => {
  const endpoint = `${idUrl}${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((response) => {
      const { title, price } = response;
      const li = createCartItemElement({ sku: id, name: title, salePrice: price });
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(li);
    });
};

const apiQuery = () => {
  const endpoint = `${URL}sites/MLB/search?q=computador`;
  fetch(endpoint)
    .then(response => response.json())
    .then(item => item.results.forEach((element) => {
      const section = createProductItemElement(element);
      section.lastChild.addEventListener('click', (event) => {
        const idRequest = getSkuFromProductItem(event.target.parentElement);
        addCart(idRequest);
      });
    }));
};

window.onload = function onload() {
  apiQuery();
  clearCart();
};
