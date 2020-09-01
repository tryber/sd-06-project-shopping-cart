function clearCar() {
  document.querySelector('.empty-cart')
  .addEventListener('click', () => {
    const prods = document.querySelector('.cart__items');
    const prod = document.querySelectorAll('.cart__item');
    prod.forEach(elem => prods.removeChild(elem));
  });
}

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

function cartItemClickListener(event) {
  const selProd = document.querySelector('.cart__items');
  selProd.removeChild(event.target);
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((response) => {
      const produto = createCartItemElement(response.id, response.title, response.price);
      const lista = document.querySelector('.cart__items');
      lista.appendChild(produto);
    });
  });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search?q=computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}`;

function computerFetch() {
  const endpoint = url;
  fetch(endpoint)
    .then(response => response.json())
    .then((obj) => {
      obj.results.forEach((elem) => {
        const secItems = document.querySelector('.items');
        const createItemChild = createProductItemElement(elem.id, elem.title, elem.thumbnail);
        secItems.appendChild(createItemChild);
      });
    });
}

window.onload = function onload() { computerFetch(); clearCar(); };
