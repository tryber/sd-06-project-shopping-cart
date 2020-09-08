function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// =========================================================================

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// =========================================================================

async function sumOfPrices(price) {
  const newPrice = document.querySelector('.total-price');
  newPrice.innerText = parseFloat(Number(newPrice.innerText) + price).toPrecision(6);
  // adicionando numeros do somatorio de cart__items dentro da variavel newprice
}

// =========================================================================

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
// =========================================================================

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// =========================================================================

function setLocalStorage() {
  const dataStorage = document.querySelector('.cart__items').innerHTML;
  localStorage.shoppingCart = dataStorage;
}
// =========================================================================

function cartItemClickListener(event) {
  const clicked = event.target;
  clicked.remove();
  const price = Number(event.target.innerText.split('$')[1]);
  const newPrice = document.querySelector('.total-price');
  newPrice.innerText = parseFloat(Number(newPrice.innerText) - price).toPrecision(6);
  // fazendo o contrario do somatorio, porem transformando o event.target numero, recuperando
  // texto especifico com split
  setLocalStorage();
}
// =========================================================================

function getLocalStorage() {
  if (localStorage.shoppingCart) {
    document.querySelector('.cart__items').innerHTML = localStorage.shoppingCart;
    document.querySelector('.cart__item').forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
  // exibir itens salvos no localstorage
}
// codigo baseado no link https://www.w3schools.com/JSREF/tryit.asp?filename=tryjsref_storage_getitem
// =========================================================================

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  setLocalStorage();
  li.addEventListener('click', cartItemClickListener);
  // a lista de compras ja está programada para apagar o item que for clicado
  return li;
}
// =========================================================================

function productId(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then(({ id, title, price }) => {
    // retornar essas propriedades
    const addedProductOnCart = createCartItemElement({
      sku: id,
      name: title,
      salePrice: price,
    });
    // onde serão appendados na seção do carrinho de
    // compras apos ser chamado no fetch 1 após criação
    // do ol no index.html
    (document.querySelector('.cart__items').appendChild(addedProductOnCart));
    setLocalStorage();
    sumOfPrices(price);
  });
}
// =========================================================================

function fetchMercadoLivre() {
  setTimeout(() => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((object) => {
      object.results.forEach(({ id, title, thumbnail }) => {
        // results done
        const product = createProductItemElement({
          sku: id,
          name: title,
          image: thumbnail,
        });
        // propriedades do elemento
        product.addEventListener('click', (event) => {
          if (event.target.className === 'item__add') {
            productId(getSkuFromProductItem(event.target.parentElement));
            // função executada para busca do id
          }
        });
        document.querySelector('.items').appendChild(product);
        // adição ao carrinho
      });
    });
  }, 1500);
}
// =========================================================================

function eraseAllItems() {
  const shoppingList = document.querySelector('.cart__items');
  while (shoppingList.hasChildNodes()) {
    // enquanto houver childNodes, remova!
    shoppingList.removeChild(shoppingList.childNodes[0]);
  }
  localStorage.clear();
  document.querySelector('.empty-cart').addEventListener('click', eraseAllItems);
  document.querySelector('.total-price').innerText = '0';
  // hardcoded
  setLocalStorage();
}
// =========================================================================

function loadingMsg() {
  const loading = document.getElementById('loadMsg');
  loading.className = 'loading';
  loading.innerText = 'Loading...';
  // criação de elementos dentro do html (baseado na função createCustomElements)
  setTimeout(() => {
    loading.remove();
  }, 1400);
  // timeout para que o html criado seja removido pouco antes da requisição do api
}
// =========================================================================

window.onload = function onload() {
  loadingMsg();
  fetchMercadoLivre();
  eraseAllItems();
  getLocalStorage();
};
