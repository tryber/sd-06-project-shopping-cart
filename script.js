

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

function createProductItemElement({ sku, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  // return section;
  document.querySelector('.items').appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// desestruturando o obj da API e pegando apenas as informações que preciso
function needInfo({ id, title, price, thumbnail }) {
  const compInfo = { id, title, price, thumbnail };
  return compInfo;
}

// criando requisição
function request() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return fetch(url)
    .then(response => response.json())
    .then(response => response.results) 
    .then((response) => {
      return response.map((element) => {
        const newObj = needInfo(element);
        createProductItemElement(newObj);
        console.log(newObj);
        return newObj;
      });
    });
}

window.onload = function onload() {
  request();
};
