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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

// const fetch = require('node-fetch');

const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search',
};

const url = `${apiInfo.api}${apiInfo.endpoint}`;
const endpoint = `${url}?q=computador`;

const showResults = (computers) => {
  let object = {};
  computers.forEach((element) => {
    object = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const productItem = createProductItemElement(object);
    const section = document.querySelector('.items');
    section.appendChild(productItem);
  });
};

const fetchComputers = () => {
  fetch(endpoint)
  .then(response => response.json())
    .then((computers) => {
      showResults(computers.results);
    });
};

window.onload = function onload() {
  fetchComputers();
};
