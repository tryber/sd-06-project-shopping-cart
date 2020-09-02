// Informações da api na qual iremos fazer a requisição
const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  endpoint: 'computador',
};
const url = `${apiInfo.api}${apiInfo.endpoint}`;

// Criando os elementos para cada produto
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Criando as imagens dos produtos
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Colocando os ítens no HTML
function includeItemcart(item) {
  const list = document.querySelector('.cart__items');
  list.appendChild(item);
}

// Renderizando os valores dos preços no carrinho
function renderPrice(value) {
  const div = document.querySelector('.total-price');
  div.innerHTML = value;
}

// Realizando a soma dos preços do carrinho
function totalSum() {
  const items = document.querySelectorAll('.cart__item');
  let sum = 0;
  if (items.length !== 0) {
    items.forEach((priceTag) => {
      const price = parseFloat(priceTag.innerHTML.split('$')[1]);
      sum += price;
      renderPrice(sum.toFixed(2));
    });
  } else {
    renderPrice('');
  }
}

// Salavando o carrinho no LocalStorage
function saveData() {
  const ol = document.querySelector('.cart__items');
  window.localStorage.setItem('myList', ol.innerHTML);
}

// Removendo ítem do carrinho ao ser clicado
function cartItemClickListener(event) {
  const item = event.target;
  item.remove();
  totalSum();
  saveData();
}

// Renderizando o ítem no carrinho
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // sumItemsCart(salePrice);
  li.addEventListener('click', cartItemClickListener);
  // saveCart(li);
  return li;
}

// Incluindo o ítem no carrinho ao clicar no botão 'Adicionar ao carrinho!'
function ItemclickListener(event) {
  saveData();
  const id = event.target.parentNode.firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const item = createCartItemElement(object);
      includeItemcart(item);
      totalSum();
    });
  // saveData();
}

// Criando o ítem retornado da API no HTML
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', ItemclickListener);
  section.appendChild(button);

  return section;
}

// Renderizando os produtos no HTML
function renderProducts(arrayProducts) {
  arrayProducts.forEach((product) => {
    const section = document.querySelector('.items');
    const itemProduct = createProductItemElement(product);
    section.appendChild(itemProduct);
  });
}

// Removendo o loading do site, conforme solicitado no requisito 7
function removeLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

// Reaizando uma requisição a API
function fetchComputer() {
  const endpoint = url;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const products = object.results;
      renderProducts(products);
      removeLoading();
    });
}

// Limpando a lista quando o botão Esvaziar Carrinho for clicado
function clearList() {
  const list = document.querySelector('.cart__items');
  while (list.firstChild) list.removeChild(list.firstChild);
  totalSum();
}

// recuperando função de limpar ítem do carrinho ao ser clicado
function retrieveClearFunction(item) {
  item.forEach(element =>
    element.addEventListener('click', cartItemClickListener),
  );
}

// Recuperando carrinho do LocalStorage
function loadCartFromLocalStorage() {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = window.localStorage.getItem('myList');
  const li = document.querySelectorAll('li');
  totalSum();
  retrieveClearFunction(li);
}

window.onload = function onload() {
  fetchComputer();
  document.querySelector('.empty-cart').addEventListener('click', clearList);
  loadCartFromLocalStorage();
};
