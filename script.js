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

const localStorageItem = (item) => {
  localStorage.setItem('cartItems', item);
};

function cartItemClickListener(event) {
  event.target.remove();
  const olCart = document.querySelector('.cart__items');
  localStorageItem(olCart.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadLocalStorage = () => {
  const localStorageToLoad = localStorage.getItem('cartItems');
  console.log(localStorageToLoad);
  const olCart = document.querySelector('.cart__items');
  olCart.innerHTML = localStorageToLoad;
  const listItem = document.querySelectorAll('.cart__item');
  listItem.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

const addToCart = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json())
  .then((response) => {
    const { title, price } = response;
    const li = createCartItemElement({ sku: id, name: title, salePrice: price });
    const olCart = document.querySelector('.cart__items');
    olCart.appendChild(li);
    localStorageItem(olCart.innerHTML);
  });
};

const fetchToCreateLayout = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then(response => response.json())
  .then(response => response.results.forEach(((resultElement) => {
    const { id, title, thumbnail } = resultElement;
    const section = createProductItemElement({ sku: id, name: title, image: thumbnail });
    section.addEventListener('click', (event) => {
      const idToRequest = getSkuFromProductItem(event.target.parentElement);
      addToCart(idToRequest);
    });
    const sectionItem = document.querySelector('.items');
    sectionItem.appendChild(section);
  })));
};

window.onload = function onload() {
  fetchToCreateLayout();
  loadLocalStorage();
};
