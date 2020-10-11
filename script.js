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
listCartCar = [];
function setLocalStorage(result) {
  listCartCar = [...listCartCar, result.innerHTML];
  localStorage.setItem('carts', JSON.stringify(listCartCar));
}// indica
function getLocalStorage() {
  localStorage.getItem('carts', JSON.parse(result));
  console.log(listCartCar, 'cartList-get');
}// retorna
/* async function totalPrice() {
  let sum = 0;
  sumPrices.forEach((index) => results[index].price );
  sum = (Math.around((sumPrices / 100)* 100));
  forTotalPrice = document.getElementsByClassName('total-price')[0];
  forTotalPrice.innerText = parseFloat(sum.toFixed(2));
  console.log(forTotalPrice, 'total price', 'cart__item');
} */
function cartItemClickListener(event) {
  const productList = document.querySelector('.cart__item');
  cartItemSelected = event.target;
  productList.remove(cartItemSelected);
  localStorage.clear();// verificar com removeItem
  setLocalStorage();
  // totalPrice();
}
function createCartItemElement(sku, name, price) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  forTotalPrice = document.querySelector('.total-price');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return ol.appendChild(li);
}

function fetchProductCar(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then(result => createCartItemElement(result.id, result.title, result.price))
  .then(result => setLocalStorage(result));
}
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => fetchProductCar(sku));
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function appendElementInSectionItems(element) {
  const itemSection = document.querySelector('.items');
  itemSection.appendChild(element);
}
function removeLoading() {
  const killloading = document.querySelector('.loading');
  killloading.remove();
}

// requisição para buscar produtos
function fetchList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((element) => {
        const data = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        const elementResp = createProductItemElement(data);
        appendElementInSectionItems(elementResp);
      });
      removeLoading();
    });
}
function loading() {
  const iniciando = document.createElement('span');
  iniciando.className = 'loading';
  iniciando.innerHTML = 'loading...';
  document.body.appendChild(iniciando);
}
window.onload = function onload() {
  loading();
  fetchList();
  getLocalStorage();
};
