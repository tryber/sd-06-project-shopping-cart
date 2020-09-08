

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
  const capturedItem = event.target;
  const cartContainer = document.querySelector('.cart__items');
  cartContainer.removeChild(capturedItem);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  const cartContainer = document.querySelector('.cart__items');
  cartContainer.appendChild(li);

  return li;
}

// mycode
function addProductToCart() {
  // capture click event
  const target = event.target;
  // accessing parent element
  const parentNode = target.parentNode;
  // searching information about ID
  const capturedId = parentNode.firstChild.innerText;
  // extract product infos from a new endpoint
  const newEndPoint = `https://api.mercadolibre.com/items/${capturedId}`;

  fetch(newEndPoint)
    .then(response => response.json())
    .then(result => createCartItemElement(result));
}

// /////

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  section.addEventListener('click', addProductToCart);

  return section;
}

// mycode

// build event listener to add chart button
// function addToCartButton() {
//   const cartButton = document.querySelector('.item__add');
//   document.addEventListener('click', (event) => {
//     event.target
//   })
// }

// function built to attach product items to the respective container
// solution created during the monitoring class
function appendItemToContainer(container, child) {
  container.appendChild(child);
}
// function built to fetch products from API
function fetchProductsFromAPI(endpoint) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${endpoint}`)
  .then(response => response.json())
  .then(data => data.results)
  .then((products) => {
    products.forEach(product =>
    appendItemToContainer(document.querySelector('.items'), createProductItemElement(product)));
  });
}


// ///

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }


window.onload = function onload() {
  fetchProductsFromAPI('computador');
};
