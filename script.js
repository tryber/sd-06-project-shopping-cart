// requisito #4: salvar itens do carrinho no LocalStorage
function localStorageSave() {
  const itemToStorage = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('item', itemToStorage);
}

// requisitos #3: identifica e exclui o item clicado, atualiza LocalSorage.
function cartItemClickListener(event) {
  const selectItem = event.target;
  selectItem.remove();
  localStorageSave();
}

// requisitos #2 e #3: criar elemento que será mostrado no carrinho #2 e adicionar evento #3
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito #2: mostrar item no carrinho e chamar função para armazenar no LocalStorage
const ShowCartItem = ({ id, title, price }) => {
  let cartObject = {};
  cartObject = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const productToCart = createCartItemElement(cartObject);
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(productToCart);
  localStorageSave();
};

// requisito #2: requisição, tratamento do resultado e chamar função de mostrar no html
const fetchById = (id) => {
  const endpointById = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpointById)
  .then(response => response.json())
    .then((computer) => {
      ShowCartItem(computer);
    });
};

// requisito #1: criar elemento img usando o parâmetro recebido
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// requisito #1: criar elementos span (sku/name) e button usando os parâmentros recebidos
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// requisito #2: obter ID
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// requisitos #1 #2: criar sections para os itens #1. Adiciona evento no button pegar ID #2
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', function () {
      const itemID = getSkuFromProductItem(section);
      // const itemID = event.target.parentElement.firstChild.innerText;|opção sem usar function
      fetchById(itemID);
    });
  return section;
}

// requisito #1 definir objeto a ser requisitado
const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search',
};

const url = `${apiInfo.api}${apiInfo.endpoint}`;
const endpoint = `${url}?q=computador`;

// requisito #1 mostrar no html todos os itens retornados pela requisição
const showAllResults = (computersArray) => {
  let objectToShow = {};
  computersArray.forEach((computador) => {
    objectToShow = {
      sku: computador.id,
      name: computador.title,
      image: computador.thumbnail,
    };
    const productItem = createProductItemElement(objectToShow);
    const sectionToShow = document.querySelector('.items');
    sectionToShow.appendChild(productItem);
  });
};

// requisito #7: mostrar loading enquanto faz a requisição.
function displayLoading() {
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerText = 'loading...';
  const container = document.querySelector('.container');
  container.appendChild(span);
}

// requisito #7: excluir elemento usado pra display loading...
function removeLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

// requisito #1 requisição, tratamento do resultado e chamar função de mostrar no html
const fetchComputers = () => {
  displayLoading();
  fetch(endpoint)
  .then(response => response.json())
    .then((computers) => {
      removeLoading();
      showAllResults(computers.results);
    });
};

// requisito #4: adicionar evento de clique aos itens recuperados do LocalStorage
function listenToRetrievedItem(itemsArray) {
  itemsArray.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

// requisito #4: recuperar itens do LocalStorage, colocar no carrinho e chamar função add evento
function retrieveLocalStorage() {
  const retrievedItem = localStorage.getItem('item');
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = retrievedItem;
  const CartItems = document.querySelectorAll('.cart__item');
  listenToRetrievedItem(CartItems);
}

// requisito #5: envaziar carrinho
function clearCartItems() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = '';
}

// requisito #5: criar evento para o botão esvaziar carrinho
function clearButtonEvent() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCartItems);
}

window.onload = function onload() {
  fetchComputers();

  if (localStorage.getItem('item')) {
    retrieveLocalStorage();
  }

  clearButtonEvent();
};
