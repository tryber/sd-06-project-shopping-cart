
function saveToLocalStorage(id, title, price) {
  if (Storage) {
    const getCartItems = JSON.parse(localStorage.getItem('cartML'));
    const arrayOfItems = (getCartItems === null ? [] : getCartItems);
    arrayOfItems.push({ id, title, price });
    localStorage.setItem('cartML', JSON.stringify(arrayOfItems));
  }
}

function removeItemFromLocalStorage(sku) {
  const arrayOfItems = JSON.parse(localStorage.getItem('cartML'));
  for (let index = 0; index < arrayOfItems.length; index += 1) {
    if (arrayOfItems[index].id === sku) {
      arrayOfItems.splice(index, 1);
      break;
    }
  }
  localStorage.setItem('cartML', JSON.stringify(arrayOfItems));
}


function cartItemClickListener(event) {
  const parentItems = document.querySelector('.cart__items');
  const item = event.target;
  removeItemFromLocalStorage(item.id);
  parentItems.removeChild(item);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: R$${salePrice}`;
  return li;
}

function addToCart(product) {
  const itemCart = document.querySelector('.cart__items');
  itemCart.addEventListener('click', cartItemClickListener);
  itemCart.appendChild(product);
}

function getFromLocalStorage() {
  if (Storage) {
    const getProductCartItems = JSON.parse(localStorage.getItem('cartML'));
    arrayOfItems = (getProductCartItems === null ? [] : getProductCartItems);
    arrayOfItems.forEach((element) => {
      const itemProduct = createCartItemElement(element);
      addToCart(itemProduct);
    });
  }
}

const fetchProductItem = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(resolve => resolve.json())
    .then((data) => {
      const itemProduct = createCartItemElement(data);
      addToCart(itemProduct);
      saveToLocalStorage(data.id, data.title, data.price);
    });
};

function createItem(item) {
  const product = document.querySelector('.items');
  product.appendChild(item);
  item.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const sku = event.currentTarget.firstChild.innerText;
      fetchProductItem(sku);
    }
  });
}

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

const fetchProducts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resolve => resolve.json())
    .then(data => data.results.forEach((element) => {
      const createProduct = createProductItemElement(element);
      createItem(createProduct);
    }));
};

window.onload = function onload() {
  fetchProducts();
  getFromLocalStorage();
};
