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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function itemClickListener(event) {
  const itemSku = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${itemSku}`;
  fetch(url)
    .then(jsonReceived => jsonReceived.json())
    .then((object) => {
      const cartList = document.querySelector('ol.cart__items');
      console.log(object);
      cartList.appendChild(createCartItemElement(object));
    })
    .catch('deu pau no add pro carrinho!');
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', itemClickListener);
  section.appendChild(button);

  return section;
}

window.onload = function onload() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
    .then(jsonReceived => jsonReceived.json())
    .then((object) => {
      const itemSection = document.querySelector('section.items');
      object.results.forEach((queryItem) => {
        itemSection.appendChild(createProductItemElement(queryItem));
      });
    })
    .catch('deu pau!');
};
