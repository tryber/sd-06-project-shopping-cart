

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const liProduct = event.target;
  liProduct.parentNode.removeChild(liProduct);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// cria URL API:
const urlML = 'https://api.mercadolibre.com/';
// requisito 2:

function fetchThisProduct(sku) {
  const cartList = document.querySelector('.cart__items');
  const endpointItem = `${urlML}/items/${sku}`;
  fetch(endpointItem)
  .then(response => response.json())
  .then(product => cartList.appendChild(
    createCartItemElement({
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    }),
  ));
}
// cria o fetch - requisito1:
function fetchProduct(term) {
  const endpointTerm = `${urlML}sites/MLB/search?q=${term}`;
  const sectionItems = document.querySelector('.items');
  fetch(endpointTerm).then(response => response.json())
  .then(query => query.results.forEach(
    product => sectionItems.appendChild(createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    })).querySelector('.item__add').addEventListener(
      'click', () => fetchThisProduct(product.id),
    ),
  ));
}


window.onload = function onload() {
  fetchProduct('computador');
};
