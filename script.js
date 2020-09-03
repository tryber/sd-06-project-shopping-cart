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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function sumCart() {
  try {
    const pricePlacer = document.querySelector('.price .total-price');
    const myCart = document.querySelectorAll('ol.cart__items li');
    if (myCart.length > 0) {
      let sum = 0;
      await myCart.forEach((item) => {
        sum += parseFloat(item.dataset.price);
      });
      pricePlacer.innerText = sum.toFixed(2);
    } else {
      pricePlacer.innerText = '-';
    }
  } catch (error) {
    throw new Error('Ocorreu um erro no cálculo do valor de seu carrinho.');
  }
}

let myCartIds = [];

function cartItemClickListener(event) {
  const indexOfItem = myCartIds.indexOf(event.target.id);
  if (indexOfItem > -1) myCartIds.splice(indexOfItem, 1);
  event.target.remove();
  sumCart()
    .catch(error => console.log(error));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.setAttribute('data-price', salePrice);
  li.setAttribute('data-title', name);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(url, id) {
  if (myCartIds.find(currId => currId === id)) throw new Error('Item NOT added - in cart already.');
  try {
    const fetchId = await fetch(url);
    const object = await fetchId.json();
    if (object.error) throw new Error(object.error);
    const cartList = document.querySelector('ol.cart__items');
    const cartItem = createCartItemElement(object);
    cartItem.addEventListener('click', cartItemClickListener);
    cartList.appendChild(cartItem);
    myCartIds.push(id);
    sumCart();
  } catch (error) {
    throw new Error(error);
  }
  return 'Item added.';
}

function itemClickListener(event) {
  const itemSku = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${itemSku}`;
  addToCart(url, itemSku)
    .catch(error => console.log(error));
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', itemClickListener);
  section.appendChild(button);

  return section;
}

function loadStoredCart(cartItems, itemsArray) {
  try {
    const cartList = document.querySelector('ol.cart__items');
    cartItems.forEach((item) => {
      cartList.appendChild(createCartItemElement(item));
    });

    myCartIds.push(itemsArray.split(','));
    sumCart();
  } catch (error) {
    throw new Error(error);
  }
  return 'Sucess';
}

function clearCart() {
  const pricePlacer = document.querySelector('.price .total-price');
  const cartList = document.querySelector('ol.cart__items');
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
  pricePlacer.innerText = '-';
  myCartIds = [];
  localStorage.removeItem('myCart');
  localStorage.removeItem('myItemsIds');
}

function loaderElement() {
  const itemSection = document.querySelector('section.items');
  const div = document.createElement('div');
  div.className = 'loading';
  div.innerHTML = 'loading...<br><img src="loading.gif">';
  itemSection.appendChild(div);
}

window.onload = function onload() {
  loaderElement();
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
    .then(jsonReceived => jsonReceived.json())
    .then((object) => {
      const itemSection = document.querySelector('section.items');
      setTimeout(() => {
        const divLoading = document.querySelector('.loading');
        divLoading.remove();
        object.results.forEach((queryItem) => {
          itemSection.appendChild(createProductItemElement(queryItem));
        });
      },
      2000);
    })
    .catch('deu pau no carregamento dos produtos!');

  const storedCart = JSON.parse(localStorage.getItem('myCart'));
  const storedIds = localStorage.getItem('myItemsIds');
  if (storedCart) {
    loadStoredCart(storedCart, storedIds);
  }

  const clearCartButton = document.querySelector('button.empty-cart');
  clearCartButton.addEventListener('click', clearCart);
};

window.addEventListener('beforeunload', () => {
  const itemsArray = [];
  const cartList = document.querySelectorAll('ol.cart__items li');
  cartList.forEach((item) => {
    itemsArray.push({ id: item.id, title: item.dataset.title, price: item.dataset.price });
  });
  localStorage.removeItem('myCart');
  localStorage.removeItem('myItemsIds');
  localStorage.setItem('myCart', JSON.stringify(itemsArray));
  localStorage.setItem('myItemsIds', myCartIds.toString());
});
