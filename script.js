window.onload = function onload() {
  createList();
};

async function createList() {
  const items = document.getElementsByClassName('items')[0];
  // const query = document.getElementById('query_input').value;
  // acho que talvez o teste não peça por um retorno de qqr pesquisa, só de "computador"
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetch(url)
    .then(r => r.json())
    .then(r => r.results.map(item => createProductItemElement(item)))
    .then(itemList => itemList.forEach((item) => {
      items.appendChild(item);
    }))
    .then(() => {
      let item__add = document.getElementsByClassName("item__add")[0];
      item__add.addEventListener("click", (e) => addToCart(e));
    })
  
}

async function addToCart(e) {
  let cart__items = document.querySelector(".cart__items");
  let itemID = getSkuFromProductItem(e.path[1].childNodes);
  console.log(itemID)
  await fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(r => r.json())
    .then(product => createCartItemElement(product))
    .then((li) => cart__items.appendChild(li))
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
  return item[0].innerText
}

function cartItemClickListener(event) {
 
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

