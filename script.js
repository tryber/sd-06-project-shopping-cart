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
      myCart.forEach((item) => {
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
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemInCart(url, id) {
  if (myCartIds.find(currId => currId === id)) return 'item já está no carrinho.';
  try {
    const fetchId = await fetch(url);
    const object = await fetchId.json();
    if (object.error) throw new Error(object.error);
    const cartList = document.querySelector('ol.cart__items');
    cartList.appendChild(createCartItemElement(object));
    myCartIds.push(id);
    sumCart();
  } catch (error) {
    throw new Error(error);
  }
  return 'Sucess';
}

function itemClickListener(event) {
  const itemSku = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${itemSku}`;
  addItemInCart(url, itemSku);
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
  cartList.innerHTML = '';
  pricePlacer.innerText = '-';
  myCartIds = [];
  localStorage.removeItem('myCart');
}

function loaderElement() {
  const itemSection = document.querySelector('section.items');
  const div = document.createElement('div');
  div.className = 'loading';
  div.innerHTML = 'loading...<br><img src="loading.gif">';
  itemSection.appendChild(div);
}

window.onload = function onload() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  loaderElement();
  fetch(url)
    .then(jsonReceived => jsonReceived.json())
    .then((object) => {
      const itemSection = document.querySelector('section.items');
      setTimeout(() => {
        itemSection.innerHTML = '';
        object.results.forEach((queryItem) => {
          itemSection.appendChild(createProductItemElement(queryItem));
        });
      },
      2000);
    })
    .catch('deu pau!');

  const storedCart = JSON.parse(localStorage.getItem('myCart'));
  const storedIds = localStorage.getItem('myItemsIds')
  if (storedCart) {
    loadStoredCart(storedCart, storedIds);
  }

  const clearCartButton = document.querySelector('button.empty-cart');
  clearCartButton.addEventListener('click', clearCart);
};

window.addEventListener('beforeunload', () => {
  const cartList = document.querySelectorAll('ol.cart__items li');
  const itemsArray = [];
  cartList.forEach((curr) => {
    itemsArray.push({ id: curr.id, title: curr.dataset.title, price: curr.dataset.price, });
  });
  localStorage.removeItem('myCart');
  localStorage.removeItem('myItemsIds');
  localStorage.setItem('myCart', JSON.stringify(itemsArray));
  localStorage.setItem('myItemsIds', myCartIds.toString());
});
