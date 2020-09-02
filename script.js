

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

// cria URL API:
const urlML = 'https://api.mercadolibre.com/';
// requisito 2:
function findThisSpecificProduct(sku) {
  return fetch(`${urlML}/items/${sku}`);
}

async function listThisProduct(sku) {
  const cartList = document.querySelector('.cart__items');
  const bringIdProduct = await findThisSpecificProduct(sku);
  const responseIdProduct = await bringIdProduct.json();
  cartList.appendChild(createCartItemElement({
    sku: responseIdProduct.id,
    name: responseIdProduct.title,
    salePrice: responseIdProduct.price,
  }),
  );
}
// cria o fetch - requisito1:
function findProduct(term) {
  return fetch(`${urlML}sites/MLB/search?q=${term}`);
}

async function showAllProducts() {
  const sectionItems = document.querySelector('.items');
  const findProductResponse = await findProduct('computador');
  const allProductsInfo = await findProductResponse.json();
  allProductsInfo.results.forEach(product => sectionItems.appendChild(
    createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    }),
  ).querySelector('.item__add').addEventListener(
    'click', () => listThisProduct(product.id),
  ),
  );
}

window.onload = function onload() {
  showAllProducts();
};
