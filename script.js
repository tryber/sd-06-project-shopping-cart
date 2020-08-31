function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProductToCart = (li) => {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
}

const fetchProductItem = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`).then(resolve => resolve.json())
  .then(itemCart => addProductToCart(createCartItemElement(itemCart)));
}

const appendItem = (product) => {
  const parentSection = document.querySelector('.items');
  parentSection.appendChild(product);
  product.addEventListener('click', (e) => {
    if (e.target.className === 'item__add') {
      const sku = e.currentTarget.firstChild.innerText;
      fetchProductItem(sku);
    }
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const displayItems = () => {
  const itemBuscado = 'computador';
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${itemBuscado}`).then(resolve => resolve.json())
    .then(data => data.results.forEach((product) => {
      appendItem(createProductItemElement(product));
    }),
  );
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

}

window.onload = function onload() {
  displayItems();

};
