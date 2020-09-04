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
const localStorageItem = (item) => {
  localStorage.setItem('cartItems', item);
  const localPrice = document.querySelector('.total-price');
  localStorage.setItem('totalPrice', localPrice.innerText);
};
function sumPrices(price) {
  const localPrice = document.querySelector('.total-price');
  const priceNow = parseFloat(localPrice.innerText);
  const priceParam = parseFloat(price);
  const summedPrice = Math.round((priceNow + priceParam) * 100) / 100;
  localPrice.innerText = summedPrice;
}

function subPrices(priceToSub) {
  const localPrice = document.querySelector('.total-price');
  const priceNow = parseFloat(localPrice.innerText);
  const getPrice = priceToSub.split('$');
  const price = parseFloat(getPrice[1]);
  const subPrice = Math.round((priceNow - price) * 100) / 100;
  localPrice.innerText = subPrice;
}

function cartItemClickListener(event) {
  const priceToSub = event.target.innerText;
  subPrices(priceToSub);
  event.target.remove();
  const olCart = document.querySelector('.cart__items');
  localStorageItem(olCart.innerHTML);
}
const emptyCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    const olCart = document.querySelector('.cart__items');
    olCart.innerHTML = '';
    localStorage.clear();
    const localPrice = document.querySelector('.total-price');
    localPrice.innerText = '0.00';
  });
};
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrices(salePrice);
  return li;
}
const loadLocalStorage = () => {
  const localStorageToLoad = localStorage.getItem('cartItems');
  const olCart = document.querySelector('.cart__items');
  olCart.innerHTML = localStorageToLoad;
  const listItem = document.querySelectorAll('.cart__item');
  listItem.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  if (localStorage.totalPrice) {
    const loadPrice = localStorage.getItem('totalPrice');
    const localPrice = document.querySelector('.total-price');
    localPrice.innerText = loadPrice;
  }
};
const addToCart = async (id) => {
  await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json())
  .then((response) => {
    const { title, price } = response;
    const li = createCartItemElement({ sku: id, name: title, salePrice: price });
    const olCart = document.querySelector('.cart__items');
    olCart.appendChild(li);
    localStorageItem(olCart.innerHTML);
  });
};
const fetchToCreateLayout = async () => {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then(response => response.json())
  .then((response) => {
    response.results.forEach(((resultElement) => {
      const { id, title, thumbnail } = resultElement;
      const section = createProductItemElement({ sku: id, name: title, image: thumbnail });
      section.addEventListener('click', (event) => {
        const idToRequest = getSkuFromProductItem(event.target.parentElement);
        addToCart(idToRequest);
      });
      const sectionItem = document.querySelector('.items');
      sectionItem.appendChild(section);
    }));
    document.querySelector('.container').removeChild(document.querySelector('.loading'));
  });
};
window.onload = function onload() {
  fetchToCreateLayout();
  loadLocalStorage();
  emptyCart();
};