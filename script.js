/*
____________________DOM's____________________
*/
const cartList = document.getElementsByClassName('cart__items')[0];
const totalPrice = document.getElementsByClassName('total-price')[0];
const sectionCart = document.getElementsByClassName('btn-cart')[0];
const sectionItens = document.getElementsByClassName('items')[0];
const loading = document.querySelector('.loading');

/*
____________________API - Information____________________
*/
const apiInfo = {
  api: 'https://api.mercadolibre.com/',
  epMBL: 'sites/MLB/',
  epItens: 'items/',
  type: 'computador',
};

const url = `${apiInfo.api}`;
const urlItens = `${url}${apiInfo.epItens}`;
const urlComputer = `${url}${apiInfo.epMBL}search?q=${apiInfo.type}`;

/*
____________________SUB-FUNCTION CLEARANCE____________________
*/
function clean(firstItem, secondItem) {
  const textPrice = secondItem.innerText;
  const itemList = firstItem.innerHTML;

  if (itemList.length >= 0) cartList.innerHTML = '';
  if (textPrice.length >= 0) totalPrice.innerText = 0;
}

/*
____________________LOCAL STORAGE HANDLE____________________
*/
function carrinhoCompras() {
  localStorage.setItem('li do carrinho', cartList.innerHTML);
}

function clearStorageAndList(listaCarrinho, precoTotal) { // line 88
  clean(listaCarrinho, precoTotal);
  localStorage.removeItem('li do carrinho', cartList.innerHTML);
}

/*
____________________ASYNC FUNCTIONS____________________
*/
async function sumPrices() {
  const carrinho = document.querySelectorAll('.cart__item'); // Espera o DOM ser criado (async)
  const numPrice = [...carrinho].map(elem => elem.textContent.match(/[0-9.0-9]+$/))
  .reduce((accumul, valor) => accumul + parseFloat(valor), 0);

  totalPrice.innerHTML = `${numPrice}`;
}

async function cartItemClickListener(event) {
  await event.remove();
  await sumPrices();
  carrinhoCompras();
}

async function addToCart(skuId) { // async para declarar que a função é async de forma sincrona
  const addLibrary = `${urlItens}${skuId}`;
  const getOlList = document.querySelector('.cart__items');
  await fetch(addLibrary) // o await tem a função de esperar a anterior acabar
  .then(response => response.json())
  .then(data => getOlList.appendChild(createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.price, // poderia ser base_price?
  })));
  await sumPrices();
  carrinhoCompras();
}

async function createWindowList() {
  fetch(urlComputer)
  .then(response => response.json())
  .then(data =>
    data.results.forEach((product) => {
      const infoProduct = createProductItemElement({
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      });
      sectionItens.appendChild(infoProduct);
    }),
  );
}

/*
____________________CREATE FUNCTIONS____________________
*/
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement(data) {
  // console.log(data);
  const { sku, name, salePrice } = data;
  // console.log(sku, name, salePrice);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => cartItemClickListener(li));
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  // sku=id image=thumbnail name=title
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => addToCart(sku));

  return section;
}

function createBtnAndClickListener() {
  const section = document.createElement('section');
  section.className = 'cartItem';

  section.appendChild(createCustomElement('button', 'empty-cart', 'Limpar Carrinho'))
  .addEventListener('click', () => clearStorageAndList(cartList, totalPrice));

  return section;
}

/*
____________________WINDOW ONLOAD____________________
*/
window.onload = async function onload() {
  setTimeout(() => {
    loading.remove();
  }, 500);
  sectionCart.appendChild(createBtnAndClickListener());
  await createWindowList();
  cartList.innerHTML = localStorage.getItem('li do carrinho');
  document.querySelectorAll('li').forEach(elem => elem.addEventListener('click', () => cartItemClickListener(elem)));
  await sumPrices();
};
