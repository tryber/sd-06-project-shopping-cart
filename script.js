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
function priceCartTotal(price) {
  const priceTotal = Math.around(Number(priceTotal) + Number(price));
  priceTotal.innerHTML = ('.price-total');
}
function setLocalStorage() {
  const listStorage = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('listStorage', listStorage);
} // input de valor

function getLocalStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.listStorage;
}// valor salvo pra usar

function cartItemClickListener(event) {
  cartItemSelected = event.target;
  cartItemSelected.remove();
  setLocalStorage();
}

function cartItemDelete() {
  productList = document.querySelector('.cart__items');
  productList.innerHTML = '';
  setLocalStorage();
}

function createCartItemElement(sku, name, price) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return ol.appendChild(li);
}

function fetchProductCar(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then(result => createCartItemElement(result.id, result.title, result.price))
  .then(result => setLocalStorage(result))
  .then(result => priceCartTotal(result.price));
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
        const data = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        console.log(data);
        appendElementInSectionItems(data);
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
  if (localStorage.getItem('listStorage')) {
    getLocalStorage();
  }
};
