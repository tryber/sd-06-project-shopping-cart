const removeElement = (cssClass) => {
  const elements = document.querySelectorAll(`.${cssClass}`);
  if (elements !== null) {
    elements.forEach((element) => {
      element.parentElement.removeChild(element);
    });
  }
};

const removeCartElements = () => {
  removeElement('cart__item');
};

const removeCartTotalPriceElement = () => {
  removeElement('total-price');
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
  console.log(indexToRemove);
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
  return parseFloat(total.toFixed(2));
};

const createTotalPriceElement = (totalPrice) => {
  const totalPriceElement = document.createElement('span');
  const cartTitleElement = document.querySelector('.cart__title');
  totalPriceElement.innerText = totalPrice;
  totalPriceElement.className = 'total-price';
  cartTitleElement.insertAdjacentElement('afterEnd', totalPriceElement);
};

const updateOrCreateTotalCartValue = async () => {
  const totalPrice = sumCartItemsPrice();
  const totalPriceElement = document.querySelector('.total-price');
  if (totalPriceElement) {
    totalPriceElement.innerText = totalPrice;
  } else {
    createTotalPriceElement(totalPrice);
  }
};

function cartItemClickListener(event) {
  const removedElementIndex = findTargetIndexInlist(event);
  event.target.remove();
  removeItemInStorage(removedElementIndex);
  updateOrCreateTotalCartValue();
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

const generateLoadingItem = () => {
  const loadingItem = document.createElement('div');
  const body = document.body;
  loadingItem.innerText = 'Loading';
  body.appendChild(loadingItem);
  loadingItem.classList = 'loading';
};

const getResponseFromApi = async (subPageUrl, searchedItem) =>
  new Promise((resolve) => {
    setTimeout(async () => {
      const responseFromApi = await fetch(`https://api.mercadolibre.com${subPageUrl}${searchedItem}`);
      const itemsFound = await responseFromApi.json();
      resolve(itemsFound);
    }, 50);
  });

const removeLoadingItem = () => {
  const loadingItem = document.querySelector('.loading');
  if (loadingItem) {
    loadingItem.parentNode.removeChild(loadingItem);
  }
};

const fetchProductItem = async (sku) => {
  try {
    generateLoadingItem();
    const response = await getResponseFromApi('/items/', sku);
    removeLoadingItem();
    if (response.error) {
      throw new Error(response.error);
    } else {
      addProductToCart(createCartItemElement(response));
      recordOnLocalStorage(response);
      updateOrCreateTotalCartValue();
    }
  } catch (error) {
    console.log(error);
  }
};

const appendItem = (product) => {
  const parentSection = document.querySelector('.items');
  parentSection.appendChild(product);
  product.addEventListener('click', (e) => {
    if (e.target.className === 'item__add') {
      const sku = e.currentTarget.firstChild.innerText;
      fetchProductItem(sku);
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

const fetchItems = async () => {
  const searchedItem = 'computador';
  const subPageUrl = '/sites/MLB/search?q=';
  generateLoadingItem();
  const itemsFound = await getResponseFromApi(subPageUrl, searchedItem);
  removeLoadingItem();
  itemsFound.results.forEach((itemFound) => {
    appendItem(createProductItemElement(itemFound));
  });
};

function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));
  if (cartItems !== null) {
    cartItems.forEach(cartItem => addProductToCart(createCartItemElement(cartItem)));
    updateOrCreateTotalCartValue();
  }
}

window.onload = function onload() {
  fetchItems();
  clearCartbuttonEvent();
  loadCart();
};
