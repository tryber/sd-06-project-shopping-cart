function showLoading() {
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'Loading...';
  const parent = document.querySelector('.items');
  parent.appendChild(loading);
}


function hideLoading() {
  setTimeout(() => {
    const parent = document.querySelector('.items');
    parent.removeChild(parent.firstChild);
  }, 1500);
}

function saveLocalStorage(key, item) {
  if (localStorage !== 0) {
    const arrei = Object.keys(localStorage);
    arrei.forEach((chave) => 
    { if (chave === key) 
      {
      const completaKey = Math.random() * 100;
      localStorage.setItem(`${key}//${completaKey}`, item);
      }
    });
  }
  localStorage.setItem(key, item);
}


function removeLocalStorage(liItem) {
  const sectionHTML = liItem.parentNode;
  const textAPI = sectionHTML.children[0].innerText;
  const arreiParteDakey = textAPI.split(' ');
  const itemID = arreiParteDakey[1];
  const tamanhoDoID = itemID.length;
  const arrei = Object.keys(localStorage);
  const keyArrei = arrei.filter(item => item.substr(0, tamanhoDoID) === itemID);
  keyArrei.sort();
  keyArrei.reverse();
  const keyRemove = keyArrei.find(item => item.substr(0, tamanhoDoID) === itemID);
  localStorage.removeItem(keyRemove);
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

async function sumCart(price) {
  const totalCart = document.querySelector('.total-price');
  totalCart.innerText = (Number(totalCart.innerText) + price);
}

async function subCart(liClick) {
  const textdoli = liClick.innerText;
  const arrei = textdoli.split('$');
  const price = Number(arrei[1]);
  const totalCart = document.querySelector('.total-price');
  totalCart.innerText = (Number(totalCart.innerText) - price);
}

async function clearPrice() {
  const totalCart = document.querySelector('.total-price');
  totalCart.innerText = '';
}

function cartItemClickListener(event) {
  const listaCarrinhoParent = document.querySelector('.cart__items');
  const liClick = event.target;
  removeLocalStorage(liClick);
  subCart(liClick);
  listaCarrinhoParent.removeChild(liClick);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumCart(salePrice);
  return li;
}

function callCreateCartItemElement(event) {
  const listaCarrinhoParent = document.querySelector('.cart__items');
  const sectionHTML = event.target.parentNode;
  const itemID = sectionHTML.children[0].innerText;
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then(response => response.json())
  .then((obj) => {
    const paramCreatecarItemElement = {
      sku: obj.id,
      name: obj.title,
      salePrice: obj.price,
    };
    const cartNewItem = createCartItemElement(paramCreatecarItemElement);
    saveLocalStorage(itemID, cartNewItem);
    return listaCarrinhoParent.appendChild(cartNewItem);
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const sectionParent = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(botao).addEventListener('click', callCreateCartItemElement);
  sectionParent.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const fetchFunction = () => {
  showLoading();
  fetch(url)
  .then(response => response.json())
  .then(obj => obj.results)
  .then((result) => {
    result.forEach((item) => {
      createProductItemElement(item);
    });
  })
  .then(hideLoading());
};

function retriveStorage() {
  const listaCarrinhoParent = document.querySelector('.cart__items');
  const arrei = Object.keys(localStorage);
  const keysBruto = arrei.map(item => item.split('//'));
  const keysOriginals = keysBruto.map(miniArrei => miniArrei[0]);
  keysOriginals.forEach((item) => {
    fetch(`https://api.mercadolibre.com/items/${item}`)
    .then(response => response.json())
    .then((obj) => {
      const paramCreatecarItemElement = {
        sku: obj.id,
        name: obj.title,
        salePrice: obj.price,
      };
      const cartNewItem = createCartItemElement(paramCreatecarItemElement);
      return listaCarrinhoParent.appendChild(cartNewItem);
    });
  });
}

function emptyCartItems() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  localStorage.clear();
  clearPrice();
}

window.onload = function onload() {
  fetchFunction();

  if (localStorage !== 0) {
    retriveStorage();
  }

  const buttonClearCart = document.querySelector('.empty-cart');
  buttonClearCart.addEventListener('click', emptyCartItems);
};
