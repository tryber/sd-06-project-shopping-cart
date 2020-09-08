

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

// mycode

// function built to attach product items to the respective container
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }


window.onload = function onload() {
  fetchProductsFromAPI('computador');
};
