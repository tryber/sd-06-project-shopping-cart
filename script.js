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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

// Salavando o carrinho no LocalStorage
function saveData() {
  const ol = document.querySelector('.cart__items');
  window.localStorage.setItem('myList', ol.innerHTML);
}

function cartItemClickListener(event) {
  const cartItem = event.target;
  const olAddItems = document.querySelector('.cart__items');

  olAddItems.removeChild(cartItem);
  saveData();
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

  retrieveClearFunction(li);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const urlApi = 'https://api.mercadolibre.com/';

function addToCart(itemId) {
  const endpoint = `${urlApi}items/${itemId}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((objectJson) => {
      const olAddItems = document.querySelector('.cart__items');
      olAddItems.appendChild(createCartItemElement(objectJson));
      saveData();
    });
}

function addToCartByClicking(allTheItens) {
  const buttonClick = allTheItens.querySelector('.item__add');
  const itemId = getSkuFromProductItem(allTheItens);

  buttonClick.addEventListener('click', function () {
    addToCart(itemId);
  });
}

//funcão que busca na api do mercado livre o resultado da url (endpoint) e retorna um objeto que é traduzido para (json), esse objeto é acessado a propriedade (results) e feito um (forEach) em todos os itens e os passando como parametro para a funcao (createProductItemElement) a qual é encarreada de criar e imprimir os produtos na tela, nessa seção ainda é recupera a seção com a classe (tems) e adicona como filho cada item criado pela função (createProductItemElement), e tambem chama a função (addToCartByClicking) que quando clicar no botão do item irá adicionar o mesmo ao carrinho de compras.
const fetchSearch = () => {
  const endpoint = `${urlApi}sites/MLB/search?q=COMPUTADOR`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((item) => {
        const section = document.querySelector('.items');
        const createItems = createProductItemElement(item);
        addToCartByClicking(createItems);
        section.appendChild(createItems);
      });
    });
};

window.onload = function onload() {
  fetchSearch();
  loadCartFromLocalStorage();
};
