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

function calculateCartTotalPrice() {
  const productsSaved = JSON.parse(localStorage.getItem('products'));
  let priceElement = document.querySelector('.total-price');

  if (!priceElement) {
    const createdPriceElement = document.createElement('p');
    createdPriceElement.className = 'total-price';
    document.querySelector('.cart').appendChild(createdPriceElement);
    priceElement = document.querySelector('.total-price');
  }

  if (productsSaved) {
    const totalPrice = productsSaved.reduce((start, next) => start + next.salePrice, 0);
    priceElement.innerText = `Preço a pagar: $${totalPrice}`;
  } else {
    priceElement.remove();
  }
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

  const productIndex = cartProducts.findIndex(item => item.sku === elementSKU);

  cartProducts.splice(productIndex, 1);
  localStorage.setItem('products', JSON.stringify(cartProducts));

  event.target.remove();
  calculateCartTotalPrice();
}

function createCartItemElement({ sku, name, salePrice, image }) {
  const li = document.createElement('li');
  const p = document.createElement('p');
  const img = document.createElement('img');

  img.src = image;
  img.alt = 'product-image';

  const container = document.createElement('div');
  container.className = 'cart-item-container';

  p.className = 'cart__item';
  p.innerText = `SKU: ${sku} \n\n NAME:\n ${name} \n\n PRICE: $${salePrice}`;

  container.appendChild(img);
  container.appendChild(p);

  li.appendChild(container);

  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadCartItems() {
  document.querySelector('.cart__items').innerHTML = '';

  const productsSaved = JSON.parse(localStorage.getItem('products'));

  if (productsSaved) {
    productsSaved.forEach((product) => {
      const { sku, name, salePrice, image } = product;
      const cartItem = createCartItemElement({ sku, name, salePrice, image });
      addClickedItemToCart(cartItem);
    });
    calculateCartTotalPrice();
  }

}

function saveToLocalStorage({ sku, name, salePrice, image }) {
  const productsSaved = JSON.parse(localStorage.getItem('products')) || [];

  const itemSaved = productsSaved.find(item => item.sku === sku);

  if (!itemSaved) {
    productsSaved.push({ sku, name, salePrice, image });
    localStorage.setItem('products', JSON.stringify(productsSaved));
  }
}

function enableEmptyCartButton() {
  const emptyBtn = document.querySelector('.empty-cart');

  emptyBtn.onclick = () => {
    localStorage.removeItem('products');
    loadCartItems();
    calculateCartTotalPrice();
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

    productElement
      .querySelector('.item__add')
      .addEventListener('click', () => {
        saveToLocalStorage({ sku, name, salePrice, image });
        loadCartItems();
        calculateCartTotalPrice();
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
    loaderText.className = 'loading';

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
}
