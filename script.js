window.onload = function onload() {
  queryApi();
};

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const items = document.querySelector('.items');
  items.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
}

function createCartItemElement({ id, title, price }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  ol.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const url = 'https://api.mercadolibre.com/';

queryApiCart = (id) => {
  const endPoint = `${url}items/${id}`;
  fetch(endPoint)
  .then(response => response.json())
  .then(data => createCartItemElement(data));
};

queryApi = () => {
  const endPoint = `${url}sites/MLB/search?q=computador`;
  fetch(endPoint)
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((item) => {
      const itemElement = createProductItemElement(item);
      itemElement.addEventListener('click', (e) => {
        if (e.target.className === 'item__add') {
          queryApiCart(item.id);
        }
      });
    });
  });
};
