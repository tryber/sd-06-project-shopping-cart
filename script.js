
// criei uma URL com o endPoint do mercado livre
const url = {
  endPointWeb: 'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  endPointItem: 'https://api.mercadolibre.com/items/',
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

// const saveOnStorage = () => {
//   const shopCart = document.querySelector('.cart__items');
//   const local = JSON.stringify(shopCart.innerHTML);
//   localStorage.setItem('local', local);
// };

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  // saveOnStorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  const carShop = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);

  carShop.appendChild(li);
}

const fetchItem = (sku) => {
  const endPoint = `${url.endPointItem}${sku}`;
  fetch(endPoint)
    .then(response => response.json())
    .then(objeto => createCartItemElement(objeto));
};

function createProductItemElement({ sku, name, image }) {
  const addButtonCar = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButtonCar.addEventListener('click', () => {
    fetchItem(sku);
    // saveOnStorage();
  });
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addButtonCar);

  return section;
}

const fetchWindow = () => {
  const endPoint = `${url.endPointWeb}`;
  const load = document.querySelector('.items');
  load.innerHTML = '<h1 class="loading">loading...</h1>';
  fetch(endPoint)
    .then(response => response.json())
    .then((objShowCase) => {
      load.innerHTML = '';
      objShowCase.results.forEach((item) => {
        const objShowC = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        const showcase = document.querySelector('.items');
        showcase.appendChild(createProductItemElement(objShowC));
      });
    });
};

// const imprima = () => console.log('clicando');
const setClearButton = () => {
  const clearButton = document.getElementsByClassName('empty-cart');
  clearButton[0].addEventListener('click', () => {
    const items = document.querySelector('.cart__items');
    items.innerHTML = '';
    // saveOnStorage();
  });
};

// const storageOnLoad = () => {
//   const localOnLoad = JSON.parse(localStorage.local);
//   console.log(localOnLoad);
// };

window.onload = function onload() {
  fetchWindow();
  setClearButton();
  // storageOnLoad();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
