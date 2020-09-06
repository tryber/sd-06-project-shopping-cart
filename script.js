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

// usada para remover algum item do carrinho
function cartItemClickListener(event) {
  const deletedKey = document.querySelector('feBlendol').childNodes;
  let currentIndex = 0;
  deletedKey.forEach((value, index) => {
    if (value === event.target) {
      currentIndex = index;
    }
  });
  const currentLocal = JSON.parse(localStorage.getItem('cartItens'));
  currentLocal.splice(currentIndex, 1);
  localStorage.setItem('cartItens', JSON.stringify(currentLocal));
  event.target.remove();
}

// req 5 - Some o valor total dos itens do carrinho de compras de forma assíncrona async-await
// function sumItens(priceItem) {
//   let totalvalue = 0;
//   if(totalvalue === 0){
//     totalvalue += priceItem;
//   }
//   // somar os preços dos itens
//    // acumular os preços -> reduce
//    // alocar os numeros que vem de priceItem em um array

//    // retornar dentro da classe total-price
//    document.querySelector('.total-price').innerText = totalvalue.toFixed(2);
// }

// req 7
function createLoadingAPI() {
  const loading = document.createElement('span');
  const getContainer = document.querySelector('.container');
  loading.className = 'loading-API';
  loading.innerText = 'loading...';
  getContainer.appendChild(loading);
}

function removeLoadingAPI() {
  document.querySelector('.loading-API').remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  document.querySelector('.cart__items').appendChild(li);

  li.addEventListener('click', cartItemClickListener);
  // sumItens(salePrice);
}

// função localStorage -req 4
// função guardando objeto clicado no local storage
function localStorageSetItem(cartItem) {
  let itens = [];
  const firstItem = JSON.parse(localStorage.getItem('cartItens'));
  if (firstItem !== null) {
    itens = firstItem;
  }
  itens.push(cartItem);
  localStorage.setItem('cartItens', JSON.stringify(itens));
}

// função acessar o local Storage
function localStorageGetItem() {
  const cartItensToJson = localStorage.getItem('cartItens');
  const cartItensArray = JSON.parse(cartItensToJson);
  if (cartItensArray !== null) {
    cartItensArray.forEach(element => createCartItemElement(element));
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// criando requisição - requisito 2 - escutar o click da função createCartItemElement com o id
function itemRequest(event) {
  const url = 'https://api.mercadolibre.com/items/';
  id = getSkuFromProductItem(event.target.parentNode);
  const urlItem = `${url}${id}`;
  fetch(urlItem)
    .then(response => response.json())
    .then((response) => {
      createCartItemElement(response);
      localStorageSetItem(response);
    });
}
// req 1
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section
    .appendChild(
      createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
    )
    .addEventListener('click', itemRequest);
  document.querySelector('.items').appendChild(section);
  return section;
}
// criando requisição - requisito 1
async function getComputerRequest() {
  createLoadingAPI();
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

  fetch(url)
    .then(response => response.json())
    .then(response => response.results)
    .then(response =>
      setTimeout(async () => {
        await response.forEach((element) => {
          createProductItemElement(element);
        });
        removeLoadingAPI();
      }, 3000),
    );
}

// req 6
function clearButton() {
  const clearList = document.querySelector('.cart__items').children;
  while (clearList.length !== 0) {
    document.querySelector('.cart__items').removeChild(clearList[0]);
  }
  localStorage.clear();
}

window.onload = function onload() {
  getComputerRequest();
  localStorageGetItem();
  document.querySelector('.empty-cart').addEventListener('click', clearButton);
};
