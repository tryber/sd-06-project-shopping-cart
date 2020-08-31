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

  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButton.addEventListener('click', itemOnCLick);
  addButton.id = sku;
  section.appendChild(addButton);

  return section;
}

function renderProducts(arrayProducts) {
  arrayProducts.forEach((product) => {
    const eachItem = createProductItemElement(product);
    const sectionItens = document.querySelector('.items');
    sectionItens.appendChild(eachItem);
  });
}

function fetchProducts() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(url)
  .then(response => response.json())
  .then((object) => {
    const results = object.results;
    renderProducts(results);
  });
}

function getSkuFromProductItem(item) {
  //  console.log(item.querySelector('span.item__sku').innerText);
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {

}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function itemOnCLick() {
  fetch(`https://api.mercadolibre.com/items/${this.id}`)
  .then(response => response.json())
  .then((object) => {
    const cartItems = document.querySelector('.cart_items');
    cartItems.appendChild(createCartItemElement(object));
  });
}
//console.log(itemOnCLick());

window.onload = function onload() {
  fetchProducts();
};
