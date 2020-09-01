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
// Requisito 3
function cartItemClickListener(event) {
  const total = document.querySelector('.total-price');
  const priceToRemove = parseFloat((event.target.innerText).split('$')[1]);
  const totalPrice = parseFloat(total.innerHTML);
  const sub = totalPrice - priceToRemove;
  total.innerText = sub;
  event.target.remove();
}
// Requisito 5
async function sumItems(li) {
  const total = document.querySelector('.total-price');
  const itemPrice = parseFloat(li.innerText.split('$')[1]);
  const totalPrice = parseFloat(total.innerHTML);
  const sum = itemPrice + totalPrice;
  total.innerText = sum;
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  sumItems(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const urlSearch = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

// Fetching items
const fetchItem = (firstChild) => {
  const cartSection = document.querySelector('.cart');
  const spanLoading = document.createElement('span');
  spanLoading.className = 'loading';
  spanLoading.innerHTML = 'loading...';
  cartSection.appendChild(spanLoading);
  fetch(`https://api.mercadolibre.com/items/${firstChild}`)
    .then(response => response.json())
    .then((item) => {
      const sku = item.id;
      const name = item.title;
      const salePrice = item.price;
      const cart = document.querySelector('.cart__items');
      cart.appendChild(createCartItemElement({ sku, name, salePrice }));
      console.log(spanLoading);
      cartSection.removeChild(spanLoading);
    });
};

// Requisito 2
const getItem = () => {
  const target = event.target;
  const parentTarget = target.parentElement;
  const firstChild = parentTarget.firstChild.innerText;
  fetchItem(firstChild);
};
// Requisito 1
const fetchUrl = () => {
  const cartSection = document.querySelector('.cart');
  const spanLoading = document.createElement('span');
  spanLoading.className = 'loading';
  spanLoading.innerHTML = 'loading...';
  cartSection.appendChild(spanLoading);
  fetch(urlSearch)
    .then(response => response.json())
    .then((object) => {
      const objectResult = object.results;
      objectResult.forEach((element) => {
        const sku = element.id;
        const name = element.title;
        const image = element.thumbnail;
        document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
        const items = document.querySelector('.items').lastChild;
        items.lastChild.addEventListener('click', getItem);
      });
      cartSection.removeChild(spanLoading);
    });
};
// Requisito 6
const emptyList = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const cart = document.querySelector('.cart__items');
    while (cart.firstChild) {
      cart.removeChild(cart.firstChild);
    }
    document.querySelector('.total-price').innerText = 0;
  });
};
window.onload = function onload() {
  fetchUrl();
  emptyList();
};
