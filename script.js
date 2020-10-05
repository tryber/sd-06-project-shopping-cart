function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement(sku, name, price) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  // const totalPrice = document.querySelector('.total-price');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  // const total = totalPrice(price);
  li.addEventListener('click', cartItemClickListener);
  return ol.appendChild(li);
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function fetchProductCar(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then(result => createCartItemElement(result.id, result.title, result.price));
}
//
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => fetchProductCar(sku));
  return section;
}

function setStore() {
  const itemList = document.querySelector('.cart_items');
  totalPrice = document.querySelector('.total-price');
  localStorage.setItem('cart_items:', itemList.innerHTML);
  localStorage.setItem('total-price:', totalPrice.innerHTML);
  console.log(totalPrice);
}
/* function getStore() {
} */

function appendElementInSectionItems(element) {
  const itemSection = document.querySelector('.items');
  itemSection.appendChild(element);
}
// requisição para buscar produtos
function fetchList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((element) => {
        const data = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        const elementResp = createProductItemElement(data);
        appendElementInSectionItems(elementResp);
      });
    });
}

window.onload = function onload() {
  setTimeout(() => { document.getElementsByClassName('.loading')[0].remove()}, 3000);
  fetchList();
  setStore();
};
