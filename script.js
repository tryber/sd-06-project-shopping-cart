function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.alt = 'Product_img';
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

function addClickedItemToCart(element) {
  document
    .querySelector('.cart__items')
    .appendChild(element);
}

function getCartElementSKU(element) {
  const elementDescription = element.innerText;
  return elementDescription.match(/MLB[0-9]+/)[0];
}

function cartItemClickListener(event) {
  const cartProducts = JSON.parse(localStorage.getItem('products'));

  const elementSKU = getCartElementSKU(event.target);

  const productIndex = cartProducts.findIndex((item) => item.sku === elementSKU);

  cartProducts.splice(productIndex, 1);
  localStorage.setItem('products', JSON.stringify(cartProducts));
  loadCartItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadCartItems() {
  document.querySelector('.cart__items').innerHTML = '';

  const productsSaved = JSON.parse(localStorage.getItem('products'));

  if (productsSaved) {
    productsSaved.forEach((product) => {
      const { sku, name, salePrice } = product;
      const cartItem = createCartItemElement({ sku, name, salePrice });
      addClickedItemToCart(cartItem);
    });
  }
}

function saveToLocalStorage({ sku, name, salePrice }) {
  const productsSaved = JSON.parse(localStorage.getItem('products')) || [];

  const itemSaved = productsSaved.find((item) => item.sku === sku);

  if (!itemSaved) {
    productsSaved.push({ sku, name, salePrice });
    localStorage.setItem('products', JSON.stringify(productsSaved));
  }
}

function enableEmptyCartButton() {
  const emptyBtn = document.querySelector('.empty-cart');

  emptyBtn.onclick = () => {
    localStorage.removeItem('products');
    loadCartItems();
  };
}

async function getAPIdata() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  let products;

  await fetch(url)
    .then(res => res.json())
    .then((resJson) => {
      products = resJson.results;
    })
    .catch(() => {
      products = [];
    });

  return products;
}

function buildAvailableProducts(products) {
  const container = document.querySelector('.items');

  products.forEach((product) => {
    const {
      id: sku, title: name, thumbnail: image, price: salePrice,
    } = product;

    const productElement = createProductItemElement({ sku, name, image });
    const futureCartItem = createCartItemElement({ sku, name, salePrice });

    productElement
      .querySelector('.item__add')
      .addEventListener('click', () => {
        addClickedItemToCart(futureCartItem);
        saveToLocalStorage({ sku, name, salePrice });
      });

    container.appendChild(productElement);
  });
}

function loading(load = true) {
  const container = document.querySelector('.items');
  container.innerHTML = '';

  if (load) {
    const loaderContainer = document.createElement('div');
    loaderContainer.style.display = 'flex';
    loaderContainer.style.alignItems = 'center';

    const loader = document.createElement('div');
    loader.className = 'loader';

    const loaderText = document.createElement('p');
    loaderText.appendChild(document.createTextNode('loading...'));

    loaderContainer.appendChild(loader);
    loaderContainer.appendChild(loaderText);

    container.appendChild(loaderContainer);
  }
}

async function buildProductsOnScreen() {
  loading();
  const products = await getAPIdata();
  loading(false);

  buildAvailableProducts(products);
  loadCartItems();
}

window.onload = function onload() {
  buildProductsOnScreen();
  enableEmptyCartButton();
};
