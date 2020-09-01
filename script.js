const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
let priceSum = 0;

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

async function decreasePrice(price) {
  priceSum -= Number(price);
  return priceSum;
}

function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(event);
  const id = Object.keys(localStorage).find(key => localStorage[key] === event.innerHTML);
  const valourString = localStorage[id].split(' ');
  localStorage.removeItem(id);
  const value = Number(valourString[valourString.length - 1].replace('$', ''));
  decreasePrice(value)
    .then((totalValue) => {
      const totalPrice = document.getElementById('price');
      totalPrice.innerHTML = `${totalValue}`;
    });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', event => cartItemClickListener(event.target));
  return li;
}

async function addPrice(price) {
  priceSum += Number(price);
  return priceSum;
}

function addCartElement(id) {
  itemUrl = `https://api.mercadolibre.com/items/${id}`;

  fetch(itemUrl)
    .then(response => response.json())
    .then((object) => {
      const element = createCartItemElement(object);
      document.querySelector('.cart__items').appendChild(element);
      localStorage.setItem(`${localStorage.length}`, element.innerHTML);
      addPrice(object.price)
        .then((total) => {
          document.getElementById('price').innerHTML = `${total}`;
        });
    });
}

function eraseCartList() {
  document.getElementById('list').innerHTML = '';
  localStorage.clear();
  priceSum = 0;
  document.getElementById('price').innerHTML = 0;
}

const fetchProductList = () => {
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((result) => {
        const item = createProductItemElement(result);
        document.querySelector('.items').appendChild(item);
      });
      document.querySelectorAll('.item__add').forEach((btn) => {
        btn.addEventListener('click', (event) => {
          const item = event.target.parentNode;
          const id = item.firstElementChild.innerHTML;
          addCartElement(id);
        });
      });
    });
};

window.onload = function onload() {
  fetchProductList(url);
  if (localStorage !== undefined) {
    Object.values(localStorage).forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = item;
      document.querySelector('.cart__items').appendChild(li);
      li.addEventListener('click', event => cartItemClickListener(event.target));
      const valourString = item.split(' ');
      const valour = Number(valourString[valourString.length - 1].replace('$', ''));
      addPrice(valour)
        .then((total) => {
          document.getElementById('price').innerHTML = `${total}`;
        });
    });
  }
  document.getElementById('price').innerHTML = `${priceSum}`;
};
