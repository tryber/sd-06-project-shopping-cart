window.onload = function onload() {
  getItems();
};

function getItems() {
  const items = document.querySelector(".items");
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
    .then(r => r.json())
    .then(r => r.results.map(item => createProductItemElement(item)))
    .then(itemList => itemList.forEach((item) => {
      items.appendChild(item);
    }))

    .then(() => {
      let item__add = document.querySelectorAll('.item__add');
      item__add.forEach(element => {
        element.addEventListener("click", (e) => addToCart(e))
      })
    })
}

function addToCart(event) {
  let parent = event.target.parentNode;
  let cart__items = document.querySelector('.cart__items');
  let itemID = getSkuFromProductItem(parent);
  console.log(itemID)
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(r => r.json())
    .then(product => createCartItemElement(product))
    .then((li) => cart__items.appendChild(li))
    .then(() => {
    
    })
}

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
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
}

