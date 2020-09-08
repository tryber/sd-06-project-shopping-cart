const api = {
  url: 'https://api.mercadolibre.com/',
  endpointSearch: 'sites/MLB/search?q=',
  endpointItem: 'items/',
};

function sum() {
  const storageValue = localStorage.getItem('cart_shopping');
  let separator = [];

  if (storageValue != null && storageValue !== '') {
    separator = storageValue.split('</li>');
  }

  let sumItens = 0;
  separator.forEach((element) => {
    if (element !== '') {
      const separatorPrice = parseFloat(element.split('$')[1]);
      sumItens += separatorPrice;
    }
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = sumItens;
}


function onLoading() {
  const load = document.createElement('span');
  load.className = 'loading';
  load.innerText = 'loading...';
  const items = document.querySelector('.items');
  items.appendChild(load);
}

function removeLoading() {
  setTimeout(() => {
    const items = document.querySelector('.items');
    const load = document.querySelector('.loading');
    items.removeChild(load);
  }, 2000);
}

function localStorageOnLoad() {
  const cartShopping = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart_shopping', cartShopping);
}

function cartItemClickListener() {
  const cartItems = document.getElementById('cart_items');
  cartItems.removeChild(this);
  localStorageOnLoad();
  sum();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function buttonItemOnClick() {
  fetch(`${api.url}${api.endpointItem}${this.id}`)
    .then(response => response.json())
    .then((data) => {
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement(data));
      localStorageOnLoad();
      sum();
    });
}

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
  const buttonItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonItem.addEventListener('click', buttonItemOnClick);
  buttonItem.id = sku;
  section.appendChild(buttonItem);

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}*/

function fetchProduct() {
  onLoading();
  fetch(`${api.url}${api.endpointSearch}computador`)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const section = document.querySelector('.items');
        const newProduct = createProductItemElement(product);
        section.appendChild(newProduct);
      });
    })
    .then(removeLoading());
}

function cleanAll() {
  const tagOl = document.getElementById('cart_items');
  while (tagOl.firstChild) {
    tagOl.removeChild(tagOl.firstChild);
  }
  localStorage.removeItem('cart_shopping');
  sum();
}

window.onload = function onload() {
  fetchProduct();

  const cleanButton = document.getElementById('empty_cart');
  cleanButton.addEventListener('click', cleanAll);

  const valueStorage = localStorage.getItem('cart_shopping');
  document.querySelector('.cart__items').innerHTML = valueStorage;

  sum();
};
