const api = {
  url: 'https://api.mercadolibre.com/',
  endpointSearch: 'sites/MLB/search?q=',
  endpointItem: 'items/',
};

function cartItemClickListener() {
  const cartItems = document.getElementById('cart_items');
  cartItems.removeChild(this);
  let keyName = '';
  for (let i = 0; i < localStorage.length; i += 1) {
    keyName = localStorage.key(i);
  }
  localStorage.removeItem(keyName);
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
      localStorage.setItem(this.id, JSON.stringify(data));
    });
}

/* function calcTotalPrice() {
  createCartItemElement()
    .then(response => response.json())
    .then((data) => {
      console.log(data)
      console.log(data.results.price)
      const propriedade = data['price'];
      const totalPrice = document.querySelector('.total-price');
      const createElement = document.createElement('p');
      createElement.innerHTML = `$${propriedade}`
      totalPrice.appendChild(createElement);
    });
}*/


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
  fetch(`${api.url}${api.endpointSearch}computador`)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const section = document.querySelector('.items');
        const newProduct = createProductItemElement(product);
        section.appendChild(newProduct);
      });
    });
}

function cleanAll() {
  const tagOl = document.getElementById('cart_items');
  while (tagOl.firstChild) {
    tagOl.removeChild(tagOl.firstChild);
  }
}


window.onload = function onload() {
  fetchProduct();

  const cleanButton = document.getElementById('empty_cart');
  cleanButton.addEventListener('click', cleanAll);
};
