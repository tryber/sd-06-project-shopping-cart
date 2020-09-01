const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
let urlId = 'https://api.mercadolibre.com/items/';


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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/


function handleComputerObj(item) {
  const computerObj = {
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
  };
  return computerObj;
}

function fetchComputers() {
  fetch(url)
    .then((response => response.json()))
    .then((object) => {
      object.results.forEach((computer) => {
        document
        .querySelector('.items')
        .appendChild(createProductItemElement(handleComputerObj(computer)));
      });
    });
}

function cartItemClickListener() {
  const itemsSection = document.querySelector('.items');
  itemsSection.addEventListener('click', function (event) {
    if (event.target.innerText === 'Adicionar ao carrinho!'); {
      const endpoint = event.target.parentNode.firstChild.innerText;
      urlId = `${urlId}${endpoint}`;
      fetchComputersId(urlId);
      urlId = 'https://api.mercadolibre.com/items/';
    }
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchComputersId(newUrlId) {
  if (newUrlId) {
    fetch(newUrlId)
    .then((response => response.json()))
    .then((object) => {
      document
      .querySelector('.cart__items')
      .appendChild(createCartItemElement(handleComputerObj(object)));
    });
  }
}


window.onload = function onload() {
  fetchComputers();
  cartItemClickListener();
};
