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

const sumTotalBill = (sum) => {
  const totalBill = document.querySelector('.cart__total');
  totalBill.innerHTML = sum;
};

async function getSumTotalBill() {
  let sum = 0;
  const totalBill = await JSON.parse(localStorage.getItem('cart'));
  if (totalBill) {
    for (let index = 0; index < totalBill.length; index += 1) {
      sum += totalBill[index].price;
    }
  }
  sumTotalBill(sum);
}

const loadItemsToLocalStorage = (id, title, price) => {
  if (Storage) {
    const getItemsSaved = JSON.parse(localStorage.getItem('cart'));
    const values = (getItemsSaved === null ? [] : getItemsSaved);
    values.push({ id, title, price });
    localStorage.setItem('cart', JSON.stringify(values));
  }
  getSumTotalBill();
};

const removeItemsFromLocalStorage = (sku) => {
  const getItemsFromLocalStorage = JSON.parse(localStorage.getItem('cart'));
  for (let index = 0; index < getItemsFromLocalStorage.length; index += 1) {
    if (getItemsFromLocalStorage[index].id === sku) {
      getItemsFromLocalStorage.splice(index, 1);
      break;
    }
  }
  localStorage.setItem('cart', JSON.stringify(getItemsFromLocalStorage));
  getSumTotalBill();
};

function cartItemClickListener(event) {
  removeItemsFromLocalStorage(event.target.id);
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = sku;
  return li;
}

const appendItemToChart = (element) => {
  const toChart = document.querySelector('.cart__items');
  toChart.appendChild(element);
};

const retrieveItemsSavedBeforeFromLocalStorage = () => {
  const getItemsFromLocalStorage = JSON.parse(localStorage.getItem('cart'));
  if (getItemsFromLocalStorage !== null) {
    for (let index = 0; index < getItemsFromLocalStorage.length; index += 1) {
      const cart = createCartItemElement(getItemsFromLocalStorage[index]);
      appendItemToChart(cart);
    }
  }
};

const fetchToChart = (skuName) => {
  const url = 'https://api.mercadolibre.com/items/';
  fetch(`${url}${skuName}`)
  .then(resolve => resolve.json())
  .then((data) => {
    appendItemToChart(createCartItemElement(data));
    loadItemsToLocalStorage(data.id, data.title, data.price);
  });
};

const appendItem = (item) => {
  const createDisplay = document.querySelector('.items');
  createDisplay.appendChild(item);
  item.addEventListener('click', (event) => {
    const getSku = event.currentTarget.firstChild.innerText;
    fetchToChart(getSku);
  });
};

const createElement = () => {
  const pElement = document.createElement('span');
  pElement.className = 'loading';
  pElement.innerHTML = 'loading...';
  const getContainerElement = document.querySelector('.items');
  getContainerElement.appendChild(pElement);
};

const eraseElement = () => {
  setTimeout(() => {
    const getContainerElement = document.querySelector('.items');
    getContainerElement.removeChild(getContainerElement.firstChild);
  }, 2000);
};

const fetchDisplay = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  const itemSearch = 'computador';
  createElement();
  fetch(`${url}${itemSearch}`)
  .then(resolve => resolve.json())
  .then(data => data.results.forEach((element) => {
    appendItem(createProductItemElement(element));
  }))
  .then(eraseElement());
};

const clearItems = () => {
  const itemsToKill = document.querySelector('.cart__items');
  itemsToKill.innerHTML = '';
  localStorage.clear();
  getSumTotalBill();
};

const clearButton = () => {
  const getButton = document.querySelector('.empty-cart');
  getButton.addEventListener('click', clearItems);
};

window.onload = function onload() {
  fetchDisplay();
  clearButton();
  retrieveItemsSavedBeforeFromLocalStorage();
  getSumTotalBill();
};
