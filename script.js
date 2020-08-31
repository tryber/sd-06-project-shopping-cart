const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const itemApiUrl = 'https://api.mercadolibre.com/items/';

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
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createItemEventListener() {
  const product = this.parentElement;
  const productSku = getSkuFromProductItem(product);
  const cartList = document.querySelector('.cart__items');
  const url = `${itemApiUrl}${productSku}`;

  fetch(url)
    .then(response => response.json())
    .then((product) => {
      const productInfo = createCartItemElement(product);

      cartList.appendChild(productInfo);
    })
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.className = 'item';
  addButton.addEventListener('click', createItemEventListener);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addButton);

  return section;
}

const fetchApi = (() => {
  const url = `${apiUrl}`;

  fetch(url)
    .then(response => response.json())
    .then((data) => {
      const itemsArray = data.results;
      const itemsSection = document.querySelector('.items');

      itemsArray.forEach((item) => {
        const newItem = createProductItemElement(item);
        itemsSection.appendChild(newItem);
      });
    });
});

window.onload = function onload() {
  fetchApi();
};
