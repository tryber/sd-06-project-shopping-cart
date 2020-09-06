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

function historic() {
  const list = document.querySelector('.cart__items');
  localStorage.setItem('list', list.innerHTML);
}

async function price() {
  let total = 0;
  const computerList = document.getElementsByClassName('cart__item');
  for (let index = 0; index < computerList.length; index += 1) {
    const product = computerList[index].innerText;
    total += Number(product.split('$')[1]);
  }
  const final = document.getElementsByClassName('total-price')[0];
  final.innerText = total;
}

function cartItemClickListener(event) {
  const listItem = document.querySelector('.cart__items');
  const selected = event.target;
  listItem.removeChild(selected);
  price();
  historic();
}

function storage() {
  const list = document.querySelector('.cart__items');
  list.innerHTML = localStorage.list;
  Array.from(document.getElementsByClassName('cart__item')).forEach((product) => {
    product.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function cartItem(event) {
  const itemID = event.path[1].childNodes[0].innerHTML;
  const api = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(api).then(response => response.json()).then((computer) => {
    const product = {
      sku: computer.id,
      name: computer.title,
      salePrice: computer.price,
    };
    const listCard = document.querySelector('.cart__items');
    listCard.appendChild(createCartItemElement(product));
    price();
    historic();
  });
}

function createItemList() {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(api).then(response => response.json()).then(data => data.results.forEach((computer) => {
    const product = {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
    const newItem = createProductItemElement(product);
    newItem.addEventListener('click', cartItem);
    const productList = document.querySelector('.items');
    productList.appendChild(newItem);
  }));
}

function listClear() {
  const listCart = document.querySelector('.cart__items');
  listCart.innerHTML = '';
  price();
  historic();
}

window.onload = function onload() {
  storage();
  price();
  createItemList();
  const buttonListClear = document.querySelector('.empty-cart');
  buttonListClear.addEventListener('click', listClear);
};
