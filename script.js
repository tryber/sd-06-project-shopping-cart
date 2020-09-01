
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function totalPrice(value) {
  const totalValue = document.querySelector('.total-price');
  totalValue.innerHTML = (parseFloat(totalValue.innerHTML) + value).toFixed(2);
}

function decreaseValue(event) {
  let totalValue = event.target.innerHTML;
  totalValue = parseFloat(totalValue.substr(totalValue.indexOf('$') + 1));
  console.log(totalValue);
  totalPrice(-totalValue);
}

function saveCart() {
  const cart = document.querySelector('.cart__items');
  const totalValue = document.querySelector('.total-price');
  localStorage.setItem('total-value', totalValue.innerHTML);
  localStorage.setItem('cart-shop', cart.innerHTML);
}

function loadSavedCart() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart-shop');
  document.querySelector('.total-price').innerHTML = localStorage.getItem('total-value');
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

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
  .addEventListener('click', () => {
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
  });
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
