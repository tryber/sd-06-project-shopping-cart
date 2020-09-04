

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
// função localStorage -req 4
function localStorageGetItem() {
  const itens = document.querySelector('.cart__items');
  localStorage.getItem(itens);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// usada para remover algum item do carrinho
function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  document.querySelector('.cart__items').appendChild(li);

  li.addEventListener('click', cartItemClickListener);

  return li;
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
  });
}
// req 1
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', itemRequest);
  document.querySelector('.items').appendChild(section);
  return section;
}
// criando requisição - requisito 1
function computerRequest() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
    .then(response => response.json())
    .then(response => response.results)
    .then(response => response.forEach((element) => {
      const newObj = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      createProductItemElement(newObj);
    }));
}

// req 5

function sum() {

}

// req 6
function clearButton() {
  const clearList = document.querySelector('.cart__items').children;
  while (clearList.length !== 0) {
    document.querySelector('.cart__items').removeChild(clearList[0]);
  }
}

window.onload = function onload() {
  computerRequest();
  localStorageGetItem();
  document.querySelector('.empty-cart').addEventListener('click', clearButton);
};
