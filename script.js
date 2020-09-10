const endpointURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
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

function totalPrice(value) {
  const totalValue = document.querySelector('.total-price');
  totalValue.innerText = Math.round((Number(totalValue.innerText) + value) * 100) / 100;
}

// function decreasingValue(event) {
//   let totalValue = event.target.innerHTML;
//   totalValue = parseFloat(totalValue.substr(totalValue.indexOf('$') + 1));
//   totalPrice(-totalValue);
// }

const saveFunction = () => {
  const items = document.querySelector('.cart__items').innerHTML;// selecting from html
  const ol = document.querySelector('ol').innerHTML;
  const totalValue = document.querySelector('.total-price').innerText;
  localStorage.setItem('cart', items);// saving at local storage
  localStorage.setItem('cart', ol);
  localStorage.setItem('price', totalValue);
};


function loadCart() {
  const itemsOnCart = document.querySelector('ol');
  itemsOnCart.innerHTML = localStorage.getItem('cart');
  const totalValue = document.querySelector('.total-price');
  totalValue.innerHTML = localStorage.getItem('price');
  const ol = document.querySelector('.cart__items');
  const allLoadedItens = document.querySelectorAll('li');
  allLoadedItens.forEach((li) => {
    li.addEventListener('click', (event) => {
      totalPrice(event);
      ol.removeChild(event.target);
      saveFunction();
    });
  });
}

function cartItemClickListener(event) {
  const list = event.target;
  event.target.remove();// removing where the mouse is pointing
  const total = document.querySelector('.total-price');// taking from html
  const itemPrice = parseFloat(list.innerText.split('$')[1]);
  const totalPrices = parseFloat(total.innerHTML);
  const result = totalPrices - itemPrice;
  total.innerText = result;
  saveFunction();
}

async function sumPrice(list) { // creating an async function for the list
  const total = document.querySelector('.total-price');
  const itemPrice = parseFloat(list.innerText.split('$')[1]);
  const totalPrices = parseFloat(total.innerHTML);
  console.log(total.innerHTML);
  const result = itemPrice + totalPrices;
  total.innerText = result;
  saveFunction();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const list = document.createElement('li');
  list.className = 'cart__item';
  list.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  saveFunction();
  sumPrice(list);
  list.addEventListener('click', cartItemClickListener);
  return list;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const sectionItems = document.querySelector('.items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      const url = sku;
      fetch(`https://api.mercadolibre.com/items/${url}`)
        .then(response => response.json())
        .then((result) => {
          const createdItem = createCartItemElement(result);
          const ol = document.querySelector('.cart__items');
          ol.appendChild(createdItem);
          saveFunction();
        });
    });
  sectionItems.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchingFunction() {
  setTimeout(() =>
  fetch(endpointURL)
    .then(response => response.json())
    .then(object => object.results)
    .then(result => result
      .forEach(resultElement => createProductItemElement(resultElement))),
      1000);
}

const clear = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    const total = document.querySelector('.total-price');
    total.innerText = 0;
    saveFunction();
  });
};

// const savingAtLocalStorage = () => {
//   if (localStorage.cartShop) {
//     document.querySelector('.cart__items').innerHTML = localStorage.cartShop;
//     document.querySelectorAll('.cart__item').forEach((item) => {
//       item.addEventListener('click', cartItemClickListener);
//     });
//     document.querySelector('.total-price').innerHTML = localStorage.totalPrices;
//   }
// };

const loadFile = () => {
  setTimeout(() => {
    const load = document.querySelector('.loading');
    load.remove();
  }, 1000);
};

window.onload = function onload() {
  loadCart();
  fetchingFunction();
  clear();
  // savingAtLocalStorage();
  loadFile();
};
