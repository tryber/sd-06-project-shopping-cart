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

function saveStorage() {
  const itemList = document.querySelectorAll('.cart__item');
  const array = [];
  itemList.forEach(el => array.push(el.innerHTML));
  localStorage.setItem('carrinho', array);
}

function cartItemClickListener(event) {
  const list = document.querySelector('.cart__items');
  const clickedItem = event.target;
  list.removeChild(clickedItem);
  saveStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchOneProduct(id) {
  const endpoint = 'https://api.mercadolibre.com/items/';
  fetch(`${endpoint}${id}`)
    .then(response => response.json())
    .then((data) => {
      const product = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      document.querySelector('.cart__items').appendChild(product);
      saveStorage();
    });
}

function handleButtonsAddtoCart() {
  document.querySelectorAll('.item__add').forEach(element =>
  element.addEventListener('click', (event) => {
    const id = event.target.parentNode.querySelector('span.item__sku').innerText;
    fetchOneProduct(id);
  }));
}

const fetchProducts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((element) => {
        const product = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        document.querySelector('.items').appendChild(product);
      });
      handleButtonsAddtoCart();
    });
};

function loadStorage() {
  const data = localStorage.getItem('carrinho');
  if (data !== null && data.length > 0) {
    const arrStr = data.split(',');
    arrStr.forEach(() => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = arrStr[0];
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('.cart__items').appendChild(li);
    });
  }
}

window.onload = function onload() {
  fetchProducts();
  loadStorage();
};
