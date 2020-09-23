function purchasesHistoric() {
  const cartList = document.querySelector('.cart__items');
  localStorage.setItem('list', cartList.innerHTML);
}

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
  subCart(liClick);
  listaCarrinhoParent.removeChild(liClick);
  purchasesHistoric();
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
    listaCarrinhoParent.appendChild(cartNewItem);
    purchasesHistoric();
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

function emptyCartItems() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  localStorage.clear();
  clearPrice();
}

function recoverLocalStorage() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.list;
  const superString = cartList.innerText;
  const arreiSeparado = superString.split(' ');
  const arreiComPreçoBruto = arreiSeparado.filter(item => item[0] === '$');
  const arreiComSifrao = arreiComPreçoBruto.map((item) => {
    if (item.substr(-4) === 'SKU:') {
      const meio = item.split('SKU:');
      const primeiroItem = meio[0];
      tamanho = (primeiroItem.length) - 1;
      const retorno = primeiroItem.substr(0, tamanho);
      return retorno;
    }
    return item;
  });
  const arreidePreços = arreiComSifrao.map((item) => {
    const tamanho = item.length;
    const stringPreco = item.substr(1, tamanho);
    const numberPreco = Number(stringPreco);
    return numberPreco;
  });
  const price = arreidePreços.reduce((acc, value) => acc + value, 0);
  sumCart(price);
}

window.onload = function onload() {
  fetchFunction();

  recoverLocalStorage();

  const buttonClearCart = document.querySelector('.empty-cart');
  buttonClearCart.addEventListener('click', emptyCartItems);
};
