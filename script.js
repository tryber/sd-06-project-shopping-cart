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
  console.log('entrou');
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

function cartItemClickListener(event) {
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const fetchAPI = () => {
  fetch(`${endpoint}computador`)
  .then(response => response.json())
  .then(data => data.results)
  .then((products) => {
    products.forEach((product) => {
      const newItem = createProductItemElement(product);
      const itemsSection = document.querySelector('.items');
      itemsSection.appendChild(newItem);
    });
  }); // id, title, thumbnail
};

window.onload = function onload() {
  fetchAPI();
};

