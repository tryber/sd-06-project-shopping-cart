/* eslint-disable arrow-parens */
// mercado livre API
const base = 'https://api.mercadolibre.com/';

// create product image
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// sum prices of products on our cart
const cartValue = async () => {
  const items = document.getElementsByTagName('li');
  let itemPrice = 0;
  const priceDisplay = document.querySelector('.total-price');

  for (let i = 0; i < items.length; i += 1) {
    itemPrice += parseFloat(items[i].innerHTML.split('$')[1]);
  }

  priceDisplay.innerText = `${itemPrice}`;
};

// funcs to delete our items or empty our cart
function cartItemClickListener(event) {
  const selectedItem = event.target;
  selectedItem.remove();
  const cartParentElement = document.querySelector('.cart__items');

  // calls func to sum prices of products in our cart
  cartValue();

  localStorage.setItem('cartStorage', cartParentElement.innerHTML);
}

const emptyCart = () => {
  const cartParentElement = document.querySelector('.cart__items');
  cartParentElement.innerHTML = '';
  localStorage.removeItem('cartStorage');

  // calls func to sum prices of products in our cart
  cartValue();
};

// create cart list item
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

// request product by id on API
const fetchProduct = (productId) => {
  const productEndpoint = `items/${productId}`;
  const productSearch = `${base}${productEndpoint}`;

  fetch(productSearch)
    .then(response => response.json())
    .then((data) => {
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(
        createCartItemElement({ sku: data.id, name: data.title, salePrice: data.price }),
      );
      // calls func to sum prices of products in our cart
      cartValue();
      localStorage.setItem('cartStorage', cartList.innerHTML);
    });
};

// get item's id
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// call previous func to get item id from parent element when click on 'Adicione ao Carrinho' button
// and add the item to user's cart
const getItemToCart = (event) => {
  const item = (event.target).parentElement;
  const id = getSkuFromProductItem(item);

  fetchProduct(id);
};

// create custom html elements
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  // add event listener product list buttons
  if (element === 'button') {
    e.addEventListener('click', getItemToCart);
  }
  return e;
}

// create html item to main product list
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// iterate product list from ML'S api to create our own list
const mblProducts = (results) => {
  results.forEach((result) => {
    const product = { sku: result.id, name: result.title, image: result.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
};

window.onload = function onload() {
  // request product list from mercado livre's api on window load and calls mblProducts function
  const endpoint = 'sites/MLB/search?q=$computador';
  const fetchComputer = (url) => {
    fetch(url)
      .then(response => response.json())
      .then(data => mblProducts(data.results));
  };
  fetchComputer(`${base}${endpoint}`);

  // add event to empty our cart
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);

  // call local storage to load our saved cart
  const loadCart = () => {
    const cartParentElement = document.querySelector('.cart__items');
    cartParentElement.innerHTML = localStorage.getItem('cartStorage');

    const cartListItems = document.getElementsByTagName('li');

    for (let i = 0; i < cartListItems.length; i += 1) {
      cartListItems[i].addEventListener('click', cartItemClickListener);
    }

    // calls func to sum prices of products in our cart
    cartValue();
  };
  loadCart();
};
