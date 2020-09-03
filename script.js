
function loading() {
  setTimeout(() => {
    const wait = document.querySelector('.loading');
    wait.remove();
  }, 1000);
}

function storeLocally() {
  if (localStorage.store) {
    document.querySelector('.cart__items').innerHTML = localStorage.store;
  }
}

function savedItems() {
  const eachItem = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('store', eachItem);
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

const emptyBtn = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const father = document.querySelector('.cart__items');
    father.innerHTML = '';
    savedItems();
  });
};

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, productPrice: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  savedItems();
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const includeHTMLSection = document.querySelector('.items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((object) => {
        const createdItem = createCartItemElement(object);
        const list = document.querySelector('.cart__items');
        list.appendChild(createdItem);
        savedItems();
      });
  });
  includeHTMLSection.appendChild(section);
  return section;
}

const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  endpoint: '$computador',
};

const url = `${apiInfo.api} ${apiInfo.endpoint}`;

fetchFn = () => {
  const lookingForProduct = url;
  fetch(lookingForProduct)
    .then(response => response.json())
    .then(object => object.results)
    .then(result => result
    .forEach((resultProduct => createProductItemElement(resultProduct))));
};

window.onload = () => {
  loading();
  fetchFn();
  storeLocally();
  emptyBtn();
};
