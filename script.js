const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
  const listaCarrinhoParent = document.querySelector('.cart__items');
  const liClick = event.target;
  listaCarrinhoParent.removeChild(liClick);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function callCreateCartItemElement(event) {
  const listaCarrinhoParent = document.querySelector('.cart__items');
  const sectionHTML = event.target.parentNode;
  const itemID = sectionHTML.children[0].innerText;
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then(response => response.json())
  .then((obj) => {
    const paramCreatecarItemElement = {
      sku: obj.id,
      name: obj.title,
      salePrice: obj.price,
    };
    const cartNewItem = createCartItemElement(paramCreatecarItemElement);
    return listaCarrinhoParent.appendChild(cartNewItem);
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const sectionParent = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(botao).addEventListener('click', callCreateCartItemElement);
  sectionParent.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchFunction = () => {
  fetch(url)
  .then(response => response.json())
  .then(obj => obj.results)
  .then((result) => {
    result.forEach((item) => {
      createProductItemElement(item);
    });
  });
};

window.onload = function onload() {
  fetchFunction();
};
