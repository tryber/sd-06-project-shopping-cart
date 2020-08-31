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
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(itemToRemove);
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

const handleProductList = (crudeProductList) => {
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

const fetchProducts = () => {
  const api = 'https://api.mercadolibre.com/';
  const endpoint = 'sites/MLB/search?q=';
  const searchTerm = 'computador';
  const requestURL = `${api}${endpoint}${searchTerm}`;

  fetch(requestURL)
    .then(response => response.json())
    .then(data => handleProductList(data.results));
};

window.onload = () => {
  fetchProducts();
};
