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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => fetchProductCar(sku));
  return section;
}
function fetchProductCar(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then(result => createCartItemElement(result.id, result.title, result.price));
}
/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */
function setLocalStorage() {
  const cartList = document.querySelector('.cart__items');
  localStorage.setItem('list', cartList.innerHTML);
  console.log(cartList.innerHTML);
}
function getLocalStorage() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('list');
}

async function totalPrice() {
  const items = document.getElementsByClassName('cart_item');
  let sum = 0;
  for (let index = 0; index < items.length; index += 1) {
    const element = items[index].innerText;
    sum += Number(element.split('$')[1]);
  }
  forTotalPrice = document.getElementsByClassName('total-price')[0];
  forTotalPrice.innerText = parseFloat(sum.toFixed(2));
}
function cartItemClickListener(event) {
  const productList = document.querySelector('.cart__items');
  cartItemSelected = event.target;
  productList.removeChild(itemSelected);
  totalPrice();
  setLocalStorage();
}
function createCartItemElement(sku, name, price) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  forTotalPrice = document.querySelector('.total-price');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return ol.appendChild(li);
}

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
  fetchList();
  setLocalStorage();
  getLocalStorage();
};
