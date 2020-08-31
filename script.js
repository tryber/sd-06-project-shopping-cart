function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const element = event.target;
  document.querySelector('.cart__items').removeChild(element);
}

function fetchSingleItem(event) {
  const idSku = event.target.parentElement.childNodes[0].innerText;
  return fetch(`https://api.mercadolibre.com/items/${idSku}`)
  .then(response => response.json())
  .then(({ id, title, price }) => ({ id, title, price }));
}

async function createCartItemElement(event) {
  const { id, price, title } = await fetchSingleItem(event);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  return li;
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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', createCartItemElement);
  section.appendChild(button);

  document.querySelector('.items').appendChild(section);
  // return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function transformObject({ id, title, price, thumbnail }) {
  newObject = {};
  newObject.sku = id;
  newObject.name = title;
  newObject.salePrice = price;
  newObject.image = thumbnail;
  return newObject;
}

function fetchItems(query = 'computador') {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then(response => response.json())
    .then(response => response.results)
    .then(response => response.map((e) => {
      const TransformedObj = transformObject(e);
      createProductItemElement(TransformedObj);
      return TransformedObj;
    }));
}

window.onload = function onload() {
  fetchItems();
};
