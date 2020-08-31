window.onload = function onload() {
  pointFetch()
};

const url = "https://api.mercadolibre.com/sites/MLB/search?q=$computador"

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

function createProductItemElement(item) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', item.id));
  section.appendChild(createCustomElement('span', 'item__title', item.title));
  section.appendChild(createProductImageElement(item.thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const sectionItem = document.querySelector('.items');
  sectionItem.appendChild(section);
  return;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const pointFetch = () => {
  let query = url;
  fetch(query)
  .then(response => response.json())
  .then(response => response.results.forEach((object) => createProductItemElement(object)))
}
