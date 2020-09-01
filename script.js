const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  endpoint: 'computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}`;

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function includeItemcart(item) {
  const list = document.querySelector('.cart__items');
  list.appendChild(item);
}

function renderPrice(value) {
  const div = document.querySelector('.total-price');
  div.innerHTML = value;
}

function totalSum() {
  const items = document.querySelectorAll('.cart__item');
  let sum = 0;
  if (items.length !== 0) {
    items.forEach((priceTag) => {
      const price = parseFloat(priceTag.innerHTML.split('$')[1]);
      sum += price;
      renderPrice(sum);
    });
  } else {
    renderPrice('');
  }
}

function cartItemClickListener(event) {
  const item = event.target;
  item.remove();
  totalSum();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // sumItemsCart(salePrice);
  li.addEventListener('click', cartItemClickListener);
  // saveCart(li);
  return li;
}

function ItemclickListener(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const item = createCartItemElement(object);
      includeItemcart(item);
      totalSum();
    });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', ItemclickListener);
  section.appendChild(button);

  return section;
}

function renderProducts(arrayProducts) {
  arrayProducts.forEach((product) => {
    const section = document.querySelector('.items');
    const itemProduct = createProductItemElement(product);
    section.appendChild(itemProduct);
  });
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

function fetchComputer() {
  const endpoint = url;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const products = object.results;
      renderProducts(products);
      removeLoading();
    });
}

function clearList() {
  const list = document.querySelector('.cart__items');
  while (list.firstChild) list.removeChild(list.firstChild);
  totalSum();
}
// let array = [];
// function saveCart(item) {
//   array.push(item);
//   console.log(array);
//   window.localStorage('myList', array);
  // const item = querySelector('.cart__items');
  // const items = document.querySelector('.cart__item');
  // const getCartList = document.querySelectorAll('.cart__item');
  // localStorage.setItem('CartList', getCartList);

  // console.log('Itens', item);
  // localStorage.setItem('item', item.innerHTML);
// }
window.onload = function onload() {
  fetchComputer();
  document.querySelector('.empty-cart').addEventListener('click', clearList);
  localStorage.getItem('item');
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
