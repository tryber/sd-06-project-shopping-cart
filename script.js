const endpoint = {
  api: 'https://api.mercadolibre.com/',
  endpointAll: 'sites/MLB/search?q=computador',
  endpointOnly: 'items/',
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function getSubtraPriceProductItem(event) {
  let price = event.target;
  price = price.innerText.split('$')[1];
  const totalPrice = document.querySelector('.total-price');
  const numberTotalPrice = Number(totalPrice.innerText);
  totalPrice.innerText = (numberTotalPrice - price);
  console.log(price);
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  const elemntoLi = event.target;
  cartItems.removeChild(elemntoLi);
  getSubtraPriceProductItem(event);
}

function setLocalStorage() {
  const listCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartList', listCart);
}

function getLocalStorage() {
  const listCart = document.querySelector('.cart__items');
  if (localStorage) {
    listCart.innerHTML = localStorage.getItem('cartList');
    const listChild = listCart.childNodes;
    listChild.forEach((children) => {
      children.addEventListener('click', cartItemClickListener);
    });
  }
}

async function getSumPriceProductItem(price) {
  const totalPrice = document.querySelector('.total-price');
  const numberTotalPrice = Number(totalPrice.innerText);
  totalPrice.innerText = (numberTotalPrice + price);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  getSumPriceProductItem(salePrice);
  return li;
}

function getSkuFromProductItem() {
  // document.querySelector('.item');
  const item = event.target.parentElement;// parentElem encontra elemento pai do evento
  return item.querySelector('span.item__sku').innerText; // elemento pai extrai o filho especificado
}

const fetchOnlyItem = () => {
  const id = getSkuFromProductItem();
  const urlEndpoint = `${endpoint.api}${endpoint.endpointOnly}${id}`;
  fetch(urlEndpoint)
    .then(response => response.json())
    .then((object) => {
      const objectResult = object;
      if (object.error) {
        throw new Error(object.error);
      } else {
        const elementOl = document.querySelector('.cart__items');
        const elementLi = createCartItemElement(objectResult);
        elementOl.appendChild(elementLi);
        setLocalStorage();
        return objectResult;
      }
    })
    .catch(error => console.log('alguma coisa deu errado')); // func que trata error
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', fetchOnlyItem);
  }
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
  const containerItem = document.querySelector('.items');
  containerItem.appendChild(section);
  return section;
}

function removeMenssage() {
  const itemsSection = document.querySelector('.items');
  const menssageLoading = document.querySelector('span');
  itemsSection.removeChild(menssageLoading);
}

const fetchAllItems = () => {
  setTimeout(() => {
    const urlEndpoint = `${endpoint.api}${endpoint.endpointAll}`;
    fetch(urlEndpoint)
      .then(response => response.json())
      .then((object) => {
        const objectResult = object.results;
        if (object.error) {
          throw new Error(object.error);
        } else {
          objectResult.forEach(data => createProductItemElement(data)); // um objeto
        }
      })
      .catch(error => console.log('alguma coisa deu errado')); // func que trata error
    removeMenssage();
  }, 1000);
};

function loading() {
  const messageLoading = document.createElement('span');
  messageLoading.innerText = 'loading...';
  messageLoading.classList.add('loading');
  const itemsSection = document.querySelector('.items');
  itemsSection.appendChild(messageLoading);
}

function eventClearCart() {
  const listItems = document.querySelector('.cart__items');
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(child => listItems.removeChild(child));
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = 0;
  localStorage.removeItem('cartList');
}

function addEventclearButton() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', eventClearCart);
}

window.onload = () => {
  loading();
  fetchAllItems();
  getLocalStorage();
  addEventclearButton();
};
