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
function addToStorage() {
  const list = document.querySelector('.cart__items').innerHTML;
  localStorage.List = list;
}
async function subValue(price) {
  const p = document.querySelector('.total-price');
  p.innerText = Math.round(((Number(p.innerText) - Number(price)) * 100)) / 100;
  localStorage.price = p.innerText;
}
async function sumValue(price) {
  const p = document.querySelector('.total-price');
  p.innerText = Math.round((Number(p.innerText) + price) * 100) / 100;
  localStorage.price = Number(p.innerText);
}
async function cartItemClickListener(event) {
  const ol = document.querySelector('ol');
  const price = event.target.innerText.split('$')[1];
  await subValue(price);
  ol.removeChild(event.target);
  addToStorage();
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
async function addtocart(e) {
  const idprod = getSkuFromProductItem(e.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${idprod}`)
      .then(response => response.json())
      .then(({ id, title, price }) => {
        const cart = document.querySelector('.cart__items');
        cart.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
        addToStorage();
        sumValue(price);
      })
      .catch(error => alert(`${error}`));
}
function fetchProductsML() {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endPoint)
  .then(response => response.json())
  .then(data => data.results)
  .then((newdata) => {
    newdata.forEach(({ id, title, thumbnail }) => {
      const section = document.getElementsByClassName('items')[0];
      const elementProduct = createProductItemElement({ sku: id, name: title, image: thumbnail });
      elementProduct.addEventListener('click', addtocart);
      section.appendChild(elementProduct);
    });
  })
  .catch('Erro');
}
function loadStorage() {
  if (localStorage.Lista) {
    document.querySelector('.cart__items').innerHTML = localStorage.Lista;
    document.querySelectorAll('.cart__item').forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
    const price = Number(localStorage.price);
    document.querySelector('.total-price').innerText = price;
  }
}
function emptyCart() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    while (ol.firstChild) {
      ol.removeChild(ol.firstChild);
    }
    addToStorage();
    document.querySelector('.total-price').innerText = '';
    localStorage.removeItem('price');
  });
}

window.onload = function onload() {
  loadStorage();
  fetchProductsML();
  emptyCart();
};
