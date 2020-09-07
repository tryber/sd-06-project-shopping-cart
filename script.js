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

// Função que cria a seção onde será inserido os itens vindos da API
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Função que retorna apenas o id da API requisitada
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Função que salva o carrinho no LocalStorage
function saveData() {
  const ol = document.querySelector('.cart__items');
  window.localStorage.setItem('myList', ol.innerHTML);
}

// Função que remove os itens do carrinho
// Chama a função (saveData) que salvará o carrinho
// agora sem o item que foi removido
function cartItemClickListener(event) {
  const cartItem = event.target;
  const olAddItems = document.querySelector('.cart__items');

  olAddItems.removeChild(cartItem);
  saveData();
}

// Função que passa pelos elementos do item que ao ser clicado
// Chama a função que irá removelo do carrinho
function retrieveClearFunction(item) {
  item.forEach(element =>
    element.addEventListener('click', cartItemClickListener),
  );
}

// Função que recupera carrinho salvo no LocalStorage
// Chama função que remove elemento do carrinho ao ser clicado
function loadCartFromLocalStorage() {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = window.localStorage.getItem('myList');
  const li = document.querySelectorAll('li');

  retrieveClearFunction(li);
}

// Função que cria os elementos que serão adicionados no carrinho
// Ao clicar no elemento adicionado no carrinho o retira de lá
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

// Corpo da URL que será feita as requisições
const urlApi = 'https://api.mercadolibre.com/';

// Fução que faz uma requisição a API do mercado livre
// Adiciona os elementos retornados como filho da (ol)
// Chama a função (saveData) que salvará o conteudo do carrinho no local storage
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

// Funçao que ao clicar no botão do item
// Chama a função (addToCart)
function addToCartByClicking(allTheItens) {
  const buttonClick = allTheItens.querySelector('.item__add');
  const itemId = getSkuFromProductItem(allTheItens);

  buttonClick.addEventListener('click', function () {
    addToCart(itemId);
  });
}

// Faz acesso a api solicitada
// Chama a função a qual criara os itens que serão empressos na tela
// Chama a função que adiciona os itens ao carrinho
// Adiciona os itns criados como filho da seção com a classe (items)
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

// Chama as seguintes funções ao abrir a tela
window.onload = function onload() {
  fetchSearch();
  loadCartFromLocalStorage();
};
