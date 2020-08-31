window.onload = function onload() { 
  getProductList();
};

const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search?q=',
  query: 'computador',
}

const url = `${apiInfo.api}${apiInfo.endpoint}${apiInfo.query}`


function getProductList() { 
  fetch(url)
    .then((response) => response.json())
    .then((object) => {
      handleProductList(object.results);
    })
}

function handleProductList(list) {
  list.forEach(element => {
    document.querySelector('.items').appendChild(createProductItemElement(element));
  });
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const testeProduto = {
  sku: 'MLB1532299476',
  name: 'Computador Completo Fácil Intel I3 04 Gb Ddr3 Hd 500 Gb ',
  image: 'http://mlb-s1-p.mlstatic.com/661738-MLB42595234121_072020-I.jpg',
}


// document.querySelector('.items').appendChild(createProductItemElement(testeProduto));



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
