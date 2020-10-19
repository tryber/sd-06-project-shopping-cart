const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function totalSum() {
  const sectionTotalprice = document.querySelector('.total-price');
  const itensCart = document.querySelectorAll('.cart__item');
  let sumTotal = 0;
  itensCart.forEach((item) => {
    const price = Number(((item.innerHTML.split('$')[1]) * 100) / 100);
    sumTotal += price;
  });
  sectionTotalprice.innerHTML = sumTotal;
}

function saveLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  const totalValue = document.querySelector('.total-price').innerHTML;
  localStorage.loadCart = cartItems;
  localStorage.total_price = totalValue;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
  totalSum();
}

function loadSavedCart() {
  const innerStorage = document.querySelector('.cart__items');
  document.querySelector('.total-price').innerHTML = localStorage.total_price;
  if (localStorage.loadCart) {
    document.querySelector('.cart__items').innerHTML = localStorage.loadCart;
    innerStorage.addEventListener('click', cartItemClickListener);
  }
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Retorna produtos específicos da API
function createProductItemElement({ id: sku, title: name, price: salePrice, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__salePrice', salePrice));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json())
    .then((data) => {
      const item = createCartItemElement(data);
      const cartItem = document.querySelector('.cart__items');
      cartItem.appendChild(item);
    });
  });
  return section;
}

function clearCart() {
  const cartState = document.querySelector('.empty-cart');
  cartState.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerHTML = '';
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Busca na Api
function fetchApi() {
  fetch(url)
    .then(response => response.json())
    .then((response) => {
      response.results.forEach((item) => {
        const product = createProductItemElement(item);
        document.querySelector('.items').appendChild(product);
      });
    })
    .then(() => loadSavedCart());
}
// Chama as principais funções após a página ser carregada
window.onload = function onload() {
  fetchApi();
};
