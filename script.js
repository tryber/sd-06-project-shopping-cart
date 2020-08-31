function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Removendo único item da lista
function cartItemClickListener(event) {
  const item = event.target;
  item.remove();
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('itemCartStorage', ol.innerHTML);
}

// Criando item a item dentro do carrinho
function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);
  localStorage.setItem('itemCartStorage', ol.innerHTML);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Esvaziando lista do carrinho
const emptyList = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = '';
  localStorage.removeItem('itemCartStorage');
};

// Fazendo requisição de apenas um item pelo id
const fetchItemById = (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then(response => response.json())
    .then(data => createCartItemElement(
      { sku: data.id, name: data.title, salePrice: data.price }));
};

const getItemToCart = (event) => {
  const item = (event.target).parentElement;
  const id = getSkuFromProductItem(item);
  fetchItemById(id);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', getItemToCart);
  }
  return e;
}

// Criando itens na lista e renderizando
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// Armazenando itens para depois renderizar
const totalResults = (results) => {
  results.forEach((result) => {
    const product = { sku: result.id, name: result.title, image: result.thumbnail };
    const itemProduct = document.querySelector('.items');
    itemProduct.appendChild(createProductItemElement(product));
  });
};

// Fazendo requisição de todos os produtos
const resultFetch = (url) => {
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      totalResults(data.results);
    });
};

window.onload = function onload() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computadores';
  resultFetch(url);
  document.querySelector('.empty-cart').addEventListener('click', emptyList);
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('itemCartStorage');
  localStorage.getItem('itemCartStorage');
};
