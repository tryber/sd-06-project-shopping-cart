const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

const saveItems = () => {
  const items = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', items);
}

// Retorna produtos específicos da API

function createProductItemElement({ id: sku, title: name, price: salePrice, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__salePrice', salePrice));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json())
    .then((data) => {
      const item = createCartItemElement(data)
      console.log(data)
      const cartItem = document.querySelector('.cart__items');
      cartItem.appendChild(item);
      //saveCart();
    }); 
  });
  return section;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  //document.querySelector('.cart__items');
}

// Busca na Api
function fetchApi() {
  fetch(url)
    .then(response => response.json())
    .then((response) => {
      console.log(response)
      response.results.forEach((item) => {
        const product = createProductItemElement(item)
        console.log(product)
        document.querySelector('.items').appendChild(product);
      });
    })
}
// Chama as principais funções após a página ser carregada
window.onload = function onload() {
  fetchApi();
};
