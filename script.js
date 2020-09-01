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

let total = [];

async function finalPrice(price) {
  const value = document.querySelector('.total-price');
  total.push(parseFloat(price));
  const result = total.reduce((acc, curl) => curl + acc);
  value.innerHTML = Math.round(result * 100) / 100;
}

async function minus(num) {
  const value = document.querySelector('.total-price');
  const result = total.reduce((acc, curl) => acc + curl);
  const final = result - num;
  total = [final];
  value.innerHTML = Math.round(final * 100) / 100;
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  const str = event.target.innerHTML;
  let value = '';
  let toNum = '';
  if (str.match(/\$[0-9]*\.[0-9]*/)) {
    value = str.match(/\$[0-9]*\.[0-9]*/)[0];
  } else {
    value = str.match(/\$[0-9]*/)[0];
  }
  toNum = parseFloat(value.substring(1));
  minus(toNum);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const list = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  list.appendChild(li);
  finalPrice(salePrice);
  return li;
}

function insertCart(position) {
  const api = 'https://api.mercadolibre.com/items/';
  const item = document.querySelectorAll('.item__add');
  const info = document.querySelectorAll('.item');
  item[position].addEventListener('click', () => {
    const endpoint = getSkuFromProductItem(info[position]);
    fetch(`${api}${endpoint}`)
      .then(response => response.json())
      .then((obj) => {
        const { id, title, price } = obj;
        createCartItemElement({
          sku: id,
          name: title,
          salePrice: price,
        });
      });
  });
}

function clearCart() {
  const clear = document.querySelector('.empty-cart');
  clear.addEventListener('click', () => {
    const items = document.querySelector('.cart__items');
    items.innerHTML = '';
    total = [0];
    finalPrice(total);
  });
}

function loading() {
  const items = document.querySelector('.items');
  const elem = createCustomElement('h3', 'loading', 'LOADING ...');
  items.appendChild(elem);
  setTimeout(() => {
    elem.remove();
  }, 500);
}

function fetchItems() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((obj) => {
      obj.results.forEach((items, i) => {
        const { id, title, thumbnail } = items;
        const products = createProductItemElement({
          sku: id,
          name: title,
          image: thumbnail,
        });
        document.querySelector('.items').appendChild(products);
        insertCart(i);
      });
    });
}

function createStringPrice() {
  const list = document.querySelector('.cart');
  const wraper = createCustomElement('div', 'div-price', '');
  const text = createCustomElement('p', 'text-price', 'Preço total: $');
  const value = createCustomElement('p', 'total-price', '0');
  list.appendChild(wraper);
  wraper.appendChild(text);
  wraper.appendChild(value);
}

window.onload = async function onload() {
  loading();
  fetchItems();
  createStringPrice();
  clearCart();
};
