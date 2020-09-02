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

const totalPrice = () => {
  const allItems = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.total-price');
  let sum = 0;
  if (allItems !== null) {
    allItems.forEach((element) => {
      sum += parseFloat(element.innerText.split('$')[1]);
    });
    total.innerText = sum;
  }
};

const createInLocalStorage = () => {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart-items', cartItems);
  totalPrice();
};

const cartItemClickListener = (event) => {
  event.target.remove();
  createInLocalStorage();
  totalPrice();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);
  return li;
}

const loading = () => {
  const loadingArea = document.querySelector('.cart');
  const spanLoading = document.createElement('span');
  spanLoading.className = 'loading';
  spanLoading.innerText = 'Loading...';
  loadingArea.appendChild(spanLoading);
};

const fetchItem = (id) => {
  loading();
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then((item) => {
      const sku = item.id;
      const name = item.title;
      const salePrice = item.price;
      const itemObject = { sku, name, salePrice };
      createCartItemElement(itemObject);
      createInLocalStorage();
    });
  if (document.querySelector('.loading') !== null) {
    document.querySelector('.loading').remove();
  }
};

const getItem = () => {
  const target = event.target;
  const parentTarget = target.parentElement;
  const id = parentTarget.firstChild.innerText;
  fetchItem(id);
};

const fetchUrl = () => {
  loading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((element) => {
        const sku = element.id;
        const name = element.title;
        const image = element.thumbnail;
        document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
        const items = document.querySelector('.items').lastChild;
        items.lastChild.addEventListener('click', getItem);
      });
      if (document.querySelector('.loading') !== null) {
        document.querySelector('.loading').remove();
      }
    });
};

const checkLocalStorage = () => {
  if (localStorage.getItem('cart-items') !== null) {
    document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart-items');
    document.querySelectorAll('.cart__item').forEach((element) => {
      element.addEventListener('click', cartItemClickListener);
    });
  }
};

const clearCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    while (cartItems.firstChild) {
      cartItems.removeChild(cartItems.firstChild);
    }
    localStorage.clear();
    totalPrice();
  });
};

window.onload = function onload() {
  fetchUrl();
  clearCart();
  checkLocalStorage();
  totalPrice();
};
