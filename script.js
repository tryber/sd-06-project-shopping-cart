prices = arrItems =>
  arrItems.reduce((acc, cur) => acc + parseFloat(cur.innerText.split('$')[1]),
  0);

async function totalPrices() {
  const items = document.querySelectorAll('.cart__item');
  const total = await prices([...items]);
  console.log(prices([...items]));
  document.querySelector('.total-price').innerText = total;
}
// Referencia: ajuda da galera do discord, entendi a referencia!!

lclStorage = () => {
  const list = document.querySelector('.cart__items').innerHTML;
  localStorage.list = list;
};

loadLclStorage = () => {
  if (localStorage.list) {
    document.querySelector('.cart__items').innerHTML = localStorage.list;
  }
};

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const items = document.querySelector('.items');
  // items.innerHTML = '<h1 class="loading">Loading</h1>';
  // items.innerHTML = '';
  items.appendChild(section);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.path[1].removeChild(event.path[0]);
  lclStorage();
  totalPrices();
}

const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.clear();
  lclStorage();
  totalPrices();
});

function createCartItemElement({ id, title, price }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  ol.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  lclStorage();
  totalPrices();
  return li;
}
const url = 'https://api.mercadolibre.com/';

function queryApiCart(id) {
  const endPoint = `${url}items/${id}`;
  fetch(endPoint)
  .then(response => response.json())
  .then(data => createCartItemElement(data));
  totalPrices();
}

queryApi = () => {
  const endPoint = `${url}sites/MLB/search?q=computador`;
  fetch(endPoint)
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((item) => {
      const itemElement = createProductItemElement(item);
      itemElement.addEventListener('click', (e) => {
        if (e.target.className === 'item__add') {
          queryApiCart(item.id);
        }
      });
    });
  });
};

window.onload = function onload() {
  document.querySelector('.items').innerHTML = '<h1 class="loading">loading...</h1>';
  setTimeout(() => {
    document.querySelector('.items').innerHTML = '';
    loadLclStorage();
    totalPrices();
    queryApi();
  }, 500);
  document.querySelectorAll('.cart__item')
  .forEach(element => element.addEventListener('click', cartItemClickListener));
};
