const urlEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

const clear = () => {
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
  });
};

function cartItemClickListener(event) {
  const item = document.querySelector('.cart__item');
  const targ = event.target;
  item.removeChild(targ);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', () => {
    const sk = sku;
    fetch(`https://api.mercadolibre.com/items/${sk}`)
    .then(response => response.json())
    .then((result) => {
      const createItem = createCartItemElement(result);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(createItem);
    });
  });
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  return section
}

function fetchFunction() {
  fetch(urlEndpoint)
    .then(response => response.json())
    .then(object => object.results)
    .then(result => result.forEach(element => createProductItemElement(element)));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  fetchFunction();
  clear();
};
