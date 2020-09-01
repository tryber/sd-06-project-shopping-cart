
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function totalPrice(value) {
  const totalValue = document.querySelector('.total-price');
  totalValue.innerText = Math.round((Number(totalValue.innerText) + value) * 100) / 100;
}

function decreaseValue(event) {
  let totalValue = event.target.innerHTML;
  totalValue = parseFloat(totalValue.substr(totalValue.indexOf('$') + 1));
  totalPrice(-totalValue);
}

function saveCart() {
  const ol = document.querySelector('ol').innerHTML;
  const totalValue = document.querySelector('.total-price').innerText;
  localStorage.setItem('cart', ol);
  localStorage.setItem('price', totalValue);
}

function loadSavedCart() {
  const itemsOnCart = document.querySelector('ol');
  itemsOnCart.innerHTML = localStorage.getItem('cart');
  const totalValue = document.querySelector('.total-price');
  totalValue.innerHTML = localStorage.getItem('price');
  const ol = document.querySelector('.cart__items');
  const allLoadedItens = document.querySelectorAll('li');
  allLoadedItens.forEach((li) => {
    li.addEventListener('click', (event) => {
      decreaseValue(event);
      ol.removeChild(event.target);
      saveCart();
    });
  });
}

function cartItemClickListener(event) {
  decreaseValue(event);
  const mainList = document.querySelector('.cart__items');
  mainList.removeChild(event.target);
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  totalPrice(salePrice);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchItem(event) {
  const sku = getSkuFromProductItem(event.target.parentNode);
  console.log(sku);
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(data => data.json())
  .then((data) => {
    const item = createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    });
    const olList = document.querySelector('.cart__items');
    olList.appendChild(item);
    saveCart();
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', fetchItem);
  return section;
}

function clearCartButton() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    document.querySelector('.total-price').innerHTML = 0;
    saveCart();
  });
}

const fetchList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((response) => {
      response.results.forEach((item) => {
        const product = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(product);
      });
    })
    .then(() => clearCartButton())
    .then(() => loadSavedCart())
    .then(() => document.querySelector('.loading').remove());
};

window.onload = function onload() {
  fetchList();
};
