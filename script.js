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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
}

function createCartItemElement({id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const urlApi = 'https://api.mercadolibre.com/';

function addToCart(itemId) {
  const endpoint = `${urlApi}items/${itemId}`
  //console.log(endpoint)
  fetch(endpoint)
    .then(response => response.json())
    .then((objectJson) => {
      //console.log(objectJson)
      const olAddItems = document.querySelector('.cart__items');
      olAddItems.appendChild(createCartItemElement(objectJson));
    });
}

function addToCartByClicking(allTheItens) {
  const buttonClick = allTheItens.querySelector('.item__add');
  const itemId = getSkuFromProductItem(allTheItens);

  buttonClick.addEventListener('click', function() {
    addToCart(itemId);
  });
};

const fetchSearch = () => {
  const endpoint = `${urlApi}sites/MLB/search?q=COMPUTADOR`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((item) => {
        const section = document.querySelector('.items');
        const createItems = createProductItemElement(item);
        addToCartByClicking(createItems);
        section.appendChild(createItems);
      });
    });  
};

window.onload = function onload() {
  fetchSearch();
};
