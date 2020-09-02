const clearCart = () => {
  const cartList = document.querySelector('.cart__items');
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
  localStorage.clear();
  const totalPriceElement = document.querySelector('.total-price');
  if (totalPriceElement) {
    totalPriceElement.parentElement.removeChild(totalPriceElement);
  }
};

const clearCartbuttonEvent = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', (e) => {
    clearCart(e);
  });
};

const findTargetIndexInlist = (event) => {
  let li = event.target;
  let i = 1;
  while (li.previousElementSibling) {
    li = li.previousElementSibling;
    i += 1;
  }
  return i;
};

const removeItemInStorage = (event) => {
  const index = findTargetIndexInlist(event)
  let arrayOfItems = JSON.parse(localStorage.getItem('cartItems'));
  arrayOfItems.splice(index,1);
  localStorage.setItem('cartItems',JSON.stringify(arrayOfItems));
};

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.currentTarget);
  removeItemInStorage(event);

}

const recordOnLocalStorage = (item) => {
    if(Storage) {
      const cartItems = JSON.parse(localStorage.getItem('cartItems'));
      let items = cartItems ?? [];
      items.push(item);
      localStorage.setItem('cartItems',JSON.stringify(items));
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

const sumCartItemsPrice =  () => {
  const cartItems =  JSON.parse(localStorage.getItem('cartItems'))
  const total =  cartItems.reduce((acc,{price}) => {
    return acc + Number(price);
  },0);
  return new Promise(resolve => resolve(total.toFixed(2)));
};

const createTotalPriceElement = (totalPrice) => {
  const totalPriceElement = document.createElement('span');
  const cartTitleElement = document.querySelector('.cart__title');
  totalPriceElement.innerText = totalPrice;
  totalPriceElement.className = 'total-price';
  cartTitleElement.insertAdjacentElement('afterEnd',totalPriceElement);
};

const changeTotalPriceElement = (totalPriceElement, totalPrice) => {
  if(totalPriceElement) {
    totalPriceElement.innerText = totalPrice;
    return true;
  }
};

const displayItemPrices = async () => {
  const totalPrice = await sumCartItemsPrice();
  const totalPriceElement = document.querySelector('.total-price');
  if (totalPriceElement) {
    changeTotalPriceElement(totalPriceElement, totalPrice);
  } else {
    createTotalPriceElement(totalPrice);
  }
};

const fetchProductItem = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`).then(resolve => resolve.json())
  .then(async (itemCart) => {
    addProductToCart(createCartItemElement(itemCart));
    await recordOnLocalStorage(itemCart);
    displayItemPrices();
  });
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

const displayItems = () => {
  const itemBuscado = 'computador';
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${itemBuscado}`).then(resolve => resolve.json())
    .then(data => data.results.forEach((product) => {
      appendItem(createProductItemElement(product));
    }),
  );
};

function getCurrentCart() {
  return JSON.stringify(document.querySelectorAll('.cart__item'));
}

function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));
  if(cartItems !== null) {
    cartItems.forEach(cartItem => addProductToCart(createCartItemElement(cartItem)));
    displayItemPrices();
  }
}

window.onload = function onload() {
  displayItems();
  clearCartbuttonEvent();
  loadCart();
};


