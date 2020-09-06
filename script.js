window.onload = function onload() { };

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const itemToRemove = event.target;
  const skuToRemoveFromStorage = itemToRemove.innerText.split('|')[0].split(' ')[1];
  let skuPosition;

  for (let index = 0; index < localStorage.length; index += 1) {
    if (localStorage.getItem(index) === skuToRemoveFromStorage) {
      skuPosition = index;
      break;
    }

    if (localStorage.length === 1) localStorage.clear();
  }

  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(itemToRemove);
  localStorage.removeItem(skuPosition);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sendProductToCart = (retrievedProduct) => {
  const { id: sku, title: name, price: salePrice } = retrievedProduct;
  const itemGoingToCart = createCartItemElement({ sku, name, salePrice });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(itemGoingToCart);
  localStorage.setItem('storageCart', cartItems.innerHTML);
};

const requestCartProduct = (itemSku) => {
  const api = 'https://api.mercadolibre.com/';
  const endpoint = 'items/';
  const sku = itemSku;
  const requestURL = `${api}${endpoint}${sku}`;

  fetch(requestURL)
    .then(response => response.json())
    .then(data => sendProductToCart(data));
};

const restoreInitialDOM = () => {
  const container = document.querySelector('.container');
  container.innerText = '';
  const items = document.createElement('section');
  items.classList.add('items');
  container.appendChild(items);

  const cart = document.createElement('cart');
  cart.classList.add('cart');
  const span = document.createElement('span');
  span.classList.add('cart__title');
  const button = document.createElement('button');
  button.classList.add('empty-cart');
  const ol = document.createElement('ol');
  ol.classList.add('cart__items');

  cart.appendChild(span);
  cart.appendChild(button);
  cart.appendChild(ol);
  container.appendChild(cart);
};

const handleProductList = (crudeProductList) => {
  restoreInitialDOM();
  const items = document.querySelector('.items');

  crudeProductList.forEach((product) => {
    const { id: sku, thumbnail: image, title: name } = product;
    const productCard = createProductItemElement({ sku, name, image });

    productCard.lastChild.addEventListener('click', function () {
      const skuToSend = productCard.firstChild.innerText;
      requestCartProduct(skuToSend);
    });

    items.appendChild(productCard);
  });
};

const fetchCartFromStorage = () => {
  const unrefinedCartItems = localStorage.getItem('storageCart');

  if (unrefinedCartItems) {
    const cartItems = unrefinedCartItems.split('</li>');

    cartItems.forEach((item, index) => {
      cartItems[index] = item.split('>')[1];
    });

    cartItems.forEach((item) => {
      const itemInfo = item.split(' | ');
      const id = itemInfo[0].split(':')[1].substring(1);
      const title = itemInfo[1].split(':')[1].substring(1);
      const price = itemInfo[2].split(':')[1].split('$')[1];

      sendProductToCart({ id, title, price });
    });
  }
};

const removeLoading = () => {
  const container = document.querySelector('.container');
  container.classList.remove('loading');
};

const handleRemoveAllButton = () => {
  document.querySelector('.empty-cart').addEventListener('click', function () {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    localStorage.clear();
  });
};

const fetchProducts = () => {
  const api = 'https://api.mercadolibre.com/';
  const endpoint = 'sites/MLB/search?q=';
  const searchTerm = 'computador';
  const requestURL = `${api}${endpoint}${searchTerm}`;

  fetch(requestURL)
    .then(response => response.json())
    .then((data) => {
      handleProductList(data.results);
      fetchCartFromStorage();
      removeLoading();
      handleRemoveAllButton();
    });
};

const loading = () => {
  const container = document.querySelector('.container');
  container.innerText = 'loading...';
  container.classList.add('loading');
};

window.onload = () => {
  loading();
  fetchProducts();
};
