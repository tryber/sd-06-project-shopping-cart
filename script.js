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

function cartItemClickListener(event) {
  const list = document.querySelector('.cart__items');
  const clickedItem = event.target;
  list.removeChild(clickedItem);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const arraySaveProduct = [];

function saveLocalStorage() {
  localStorage.setItem('products', JSON.stringify(arraySaveProduct));
}
function fetchOneProduct(id) {
  const endpoint = 'https://api.mercadolibre.com/items/';
  fetch(`${endpoint}${id}`)
    .then(response => response.json())
    .then((data) => {
    // console.log(data);
      const product = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      arraySaveProduct.push(product.innerText);
      console.log(arraySaveProduct);
      saveLocalStorage();
      return document.querySelector('.cart__items').appendChild(product);
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
  dataFromStorage = JSON.parse(localStorage.getItem('products'));
  console.log(dataFromStorage);
  for (i = 0; i < dataFromStorage.length; i += 1) {
    const li = document.createElement('li');
    li.innerText = dataFromStorage[i];
    document.querySelector('ol').appendChild(li);
  }
}

window.onload = function onload() {
  fetchProducts();
  loadStorage();
};
