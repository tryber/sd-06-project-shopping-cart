const urlEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

const saveStorage = () => {
  const items = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', items);
};

function cartItemClickListener(event) {
  const section = document.querySelector('.cart__items');
  const item = event.target;
  section.removeChild(item);
  saveStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const list = document.createElement('li');
  list.className = 'cart__item';
  list.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  list.addEventListener('click', cartItemClickListener);
  return list;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    const id = sku;
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then(response => response.json())
      .then((result) => {
        const createItem = createCartItemElement(result);
        const list = document.querySelector('.cart__items');
        list.appendChild(createItem);
        saveStorage();
      });
  });
  items.appendChild(section);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const fetchFunction = () => {
  fetch(urlEndpoint)
    .then(response => response.json())
    .then(object => object.results)
    .then(result => result.forEach(element => createProductItemElement(element)));
};

const clear = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const section = document.querySelector('.cart__items');
    section.innerHTML = '';
  });
};

const storageItems = () => {
  if (localStorage.cart) {
    document.querySelector('.cart__items').innerHTML = localStorage.cart;
  }
};

const sumPrices = () => {
  const cart = document.querySelector('.cart__items');
  console.log(cart);
  // const arrayCart = cart.split(' ');
  // const total = arrayCart[arrayCart.length - 1].slice(1);
  // const number = parseInt(total);

  return cart;
};

window.onload = function onload() {
  fetchFunction();
  clear();
  storageItems();
  sumPrices();
};
