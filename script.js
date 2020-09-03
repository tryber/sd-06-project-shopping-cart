

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener(
      'click', () => listThisProduct(sku),
    )

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

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

// botão financeiramente consciente:
function clearAllItemsListed() {
  const emptyAllButton = document.querySelector('.empty-cart');
  emptyAllButton.addEventListener(
    'click',
    function () {
      document.querySelector('.cart__items').innerHTML = '';
    },
  );
}

// cria URL API:
const urlML = 'https://api.mercadolibre.com/';
// requisito 2:
function findThisSpecificProduct(sku) {
  return fetch(`${urlML}/items/${sku}`);
}

function listThisProduct(sku) {
  const cartList = document.querySelector('.cart__items');
  findThisSpecificProduct(sku)
  .then(bringIdProduct => bringIdProduct.json())
  .then(responseIdProduct =>
    cartList.appendChild(createCartItemElement({
      sku: responseIdProduct.id,
      name: responseIdProduct.title,
      salePrice: responseIdProduct.price,
    }),
  )
  );
}
// cria o fetch - requisito1:
function findProduct(term) {
  return fetch(`${urlML}sites/MLB/search?q=${term}`);
}

function showAllProducts() {
  const sectionItems = document.querySelector('.items');
  findProduct('computador')
  .then( query => query.json())
  .then( allProductsInfo =>
    allProductsInfo.results.forEach(product => sectionItems.appendChild(
      createProductItemElement(product),
    ))
  );
}

window.onload = function onload() {
  showAllProducts();
  clearAllItemsListed();
};
