let cartStorage = [];
let totalPrice = 0;

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

const getPriceFromString = str => Number(str.slice(-str.length + str.indexOf('$') + 1));

const getTotalPriceFromCart = cart => cart
  .reduce((acc, item) => acc + getPriceFromString(item.innerText), 0);

const displayPrice = (price) => {
  document.querySelector('.total-price').innerText = Math.round(price * 100) / 100;
};

const updateLocalStorage = (cart) => {
  const cartLocal = cart.map(item => item.innerText);
  localStorage.setItem('cart', JSON.stringify(cartLocal));
  if (cartLocal.length === 0) {
    localStorage.removeItem('cart');
  }
};

function cartItemClickListener(event) {
  const cartElements = document.querySelector('.cart__items');
  cartStorage = cartStorage.filter(element => element.innerText !== event.target.innerText);
  totalPrice -= getPriceFromString(event.target.innerText);
  displayPrice(totalPrice);
  cartElements.removeChild(event.target);
  updateLocalStorage(cartStorage);
}

const loadCartFromStorage = () => {
  if (localStorage.cart !== undefined) {
    const cartFromStorage = JSON.parse(localStorage.getItem('cart'));
    const cartElements = document.querySelector('.cart__items');
    cartFromStorage.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = item;
      cartStorage.push(li);
      li.addEventListener('click', cartItemClickListener);
      cartElements.appendChild(li);
    });
    totalPrice = getTotalPriceFromCart(cartStorage);
    displayPrice(totalPrice);
  }
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const toggleLoading = () => {
  const cartElem = document.querySelector('.cart');

  if (!document.querySelector('.loading')) {
    const loading = document.createElement('p');
    loading.className = 'loading';
    loading.innerText = 'loading...';
    cartElem.appendChild(loading);
  } else {
    cartElem.removeChild(document.querySelector('.loading'));
  }
};

const fetchItemBySKU = async (sku) => {
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  const cartElements = document.querySelector('.cart__items');

  let price = 0;

  toggleLoading();

  await fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const newCartItem = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });

      cartElements.appendChild(newCartItem);
      cartStorage.push(newCartItem);
      updateLocalStorage(cartStorage);
      price = data.price;
    });

  toggleLoading();

  return price;
};

const fetchItems = async (query = 'computador') => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  toggleLoading();
  await fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const items = data.results.map((prod) => {
        const item = createProductItemElement({
          sku: prod.id,
          name: prod.title,
          image: prod.thumbnail,
        });
        document.querySelector('.items').appendChild(item);
        return item;
      });
      return items;
    })
    .then((items) => {
      items.forEach((i) => {
        i.children[3].addEventListener('click', async () => {  // botao de adicionar carrinho
          totalPrice += await fetchItemBySKU(getSkuFromProductItem(i));
          displayPrice(totalPrice);
        });
      });
    });
  toggleLoading();
};

window.onload = async function onload() {
  await fetchItems();
  loadCartFromStorage();

  const emptyCartBtn = document.querySelector('button.empty-cart');

  emptyCartBtn.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    while (cartItems.firstChild) {
      cartItems.removeChild(cartItems.lastChild);
    }
    cartStorage = [];
    updateLocalStorage(cartStorage);
    totalPrice = 0;
    displayPrice(totalPrice);
  });
};
