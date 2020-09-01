const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

const saveItems = () => {
  const items = document.querySelector('.cart__items').innerHTML;
  // const total = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('cart', items);
  // localStorage.setItem('total', total);
};

function cartItemClickListener(event) {
  const li = event.target;
  event.target.remove();
  const itemPrice = parseFloat(li.innerText.split('$')[1]);
  const total = document.querySelector('.total-price');
  const totalPrice = parseFloat(total.innerHTML);
  const result = totalPrice - itemPrice;
  total.innerText = result;
  total.innerText = result;
  saveItems();
}

async function sum(li) {
  const total = document.querySelector('.total-price');
  const itemPrice = parseFloat(li.innerText.split('$')[1]);
  const totalPrice = parseFloat(total.innerHTML);
  const result = itemPrice + totalPrice;
  total.innerText = result;
  saveItems();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  saveItems();
  sum(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const sectionHTML = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      const sk = sku;
      fetch(`https://api.mercadolibre.com/items/${sk}`)
        .then(response => response.json())
        .then((result) => {
          const createItem = createCartItemElement(result);
          const ol = document.querySelector('.cart__items');
          ol.appendChild(createItem);
          saveItems();
        });
    });
  sectionHTML.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchFunc() {
  setTimeout(() =>
  fetch(url)
    .then(response => response.json())
    .then(object => object.results)
    .then(result => result.forEach(resultElement => createProductItemElement(resultElement))),
    1000);
}

const clear = () => {
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    const total = document.querySelector('.total-price');
    total.innerText = 0;
    saveItems();
  });
};

const storage = () => {
  if (localStorage.cart) document.querySelector('.cart__items').innerHTML = localStorage.cart;
  // if (localStorage.total) document.querySelector('.total-price').innerHTML = localStorage.total;
};

const loading = () => {
  setTimeout(() => {
    const load = document.querySelector('.loading');
    load.remove();
  }, 1000);
};

window.onload = function onload() {
  fetchFunc();
  clear();
  storage();
  loading();
};
