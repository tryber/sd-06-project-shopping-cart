const removeCartElements = () => {
  const cartList = document.querySelector('.cart__items');
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
};

const removeCartTotalPriceElement = () => {
  const totalPriceElement = document.querySelector('.total-price');
  if (totalPriceElement) {
    totalPriceElement.parentElement.removeChild(totalPriceElement);
  }
};

const clearCart = () => {
  removeCartElements();
  localStorage.clear();
  removeCartTotalPriceElement();
};

const clearCartbuttonEvent = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', (e) => {
    clearCart(e);
  });
};

const findTargetIndexInlist = (event) => {
  const ol = document.querySelector('ol');
  let removedElementIndex;
  ol.childNodes.forEach((node, index) => {
    if (event.currentTarget === node) {
      removedElementIndex = index;
    }
  });
  return removedElementIndex;
};

const removeItemInStorage = (indexToRemove) => {
  const arrayOfItems = JSON.parse(localStorage.getItem('cartItems'));
  arrayOfItems.splice(indexToRemove, 1);
  localStorage.setItem('cartItems', JSON.stringify(arrayOfItems));
};

const sumCartItemsPrice = () => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));
  let total;
  if (cartItems !== null) {
    total = cartItems.reduce((acc, { price }) => acc + Number(price), 0);
  } else {
    total = 0;
  }
  return new Promise(resolve => resolve(total.toPrecision(6)));
};

const createTotalPriceElement = (totalPrice) => {
  const totalPriceElement = document.createElement('span');
  const cartTitleElement = document.querySelector('.cart__title');
  totalPriceElement.innerText = totalPrice;
  totalPriceElement.className = 'total-price';
  cartTitleElement.insertAdjacentElement('afterEnd', totalPriceElement);
};

function changeTotalPriceElement(totalPrice) {
  const currentPrice = document.querySelector('.total-price');
  currentPrice.innerText = totalPrice;
}

const displayItemPrices = async () => {
  const totalPrice = await sumCartItemsPrice();
  const totalPriceElement = document.querySelector('.total-price');
  if (totalPriceElement) {
    changeTotalPriceElement(totalPrice);
  } else {
    createTotalPriceElement(totalPrice);
  }
};

function cartItemClickListener(event) {
  const removedElementIndex = findTargetIndexInlist(event);
  event.target.parentNode.removeChild(event.currentTarget);
  removeItemInStorage(removedElementIndex);
  displayItemPrices();
}

const recordOnLocalStorage = (item) => {
  if (Storage) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    let items = [];
    if (cartItems !== null) {
      items = cartItems;
    }
    items.push(item);
    localStorage.setItem('cartItems', JSON.stringify(items));
  }
  return Promise.resolve();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (e) => {
    cartItemClickListener(e);
  });
  return li;
}

const addProductToCart = (li) => {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
};

const fetchProductItem = async (sku) => {
  try {
    const response  = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const itemCart = await response.json();

    if (itemCart.error) {
      throw new Error(itemCart.error);
    } else {
      addProductToCart(createCartItemElement(itemCart));
      await recordOnLocalStorage(itemCart);
      displayItemPrices();
    }
  } catch (error) {
    console.log(error);
  }

};

const appendItem = (product) => {
  const parentSection = document.querySelector('.items');
  parentSection.appendChild(product);
  product.addEventListener('click', async (e) => {
    if (e.target.className === 'item__add') {
      const sku = e.currentTarget.firstChild.innerText;
      await fetchProductItem(sku);
    }
  });
};

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

const displayItems = async () => {
  const searchedItem = 'computador';
  const responseFromApi = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchedItem}`);
  const itemsFound = await responseFromApi.json();
  itemsFound.results.forEach(itemFound => appendItem(createProductItemElement(itemFound)));
};

function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));
  if (cartItems !== null) {
    cartItems.forEach(cartItem => addProductToCart(createCartItemElement(cartItem)));
    displayItemPrices();
  }
}

window.onload = function onload() {
  displayItems();
  clearCartbuttonEvent();
  loadCart();
};
