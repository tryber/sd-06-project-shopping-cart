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
  event.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);

  const cartSection = document.querySelector('.cart');
  cartSection.appendChild(li);

  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchItemList(event) {
  const item = event.target.parentElement;
  const id = getSkuFromProductItem(item);
  const url = `https://api.mercadolibre.com/items/${id}`;

  fetch(url)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      document.querySelector('.cart__items').appendChild(createCartItemElement(object));
    })
    .catch(error => window.alert(error));
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  const itemsSection = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', event => fetchItemList(event));

  itemsSection.appendChild(section);
  return section;
}

function fetchProductList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

  fetch(url)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach(item => createProductItemElement(item));
    });
}

window.onload = function onload() {
  fetchProductList();
};
