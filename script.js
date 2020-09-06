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
  const listItem = document.querySelector('.cart__items');
  const selected = event.target;
  listItem.removeChild(selected);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function cartItem(event) {
  const itemID = event.path[1].childNodes[0].innerHTML;
  const api = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(api).then(response => response.json()).then((computer) => {
    const product = {
      sku: computer.id,
      name: computer.title,
      salePrice: computer.price,
    };
    const listCard = document.querySelector('.cart__items');
    listCard.appendChild(createCartItemElement(product));
  });
}

function createItemList() {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(api).then(response => response.json()).then(data => data.results.forEach((computer) => {
    const product = {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
    const newItem = createProductItemElement(product);
    newItem.addEventListener('click', cartItem);
    const productList = document.querySelector('.items');
    productList.appendChild(newItem);
  }));
}

window.onload = function onload() {
  createItemList();
};
