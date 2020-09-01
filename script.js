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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const requiredUrl = 'https://api.mercadolibre.com/items/';

function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const api = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search?q=$computador',
};

const url = `${api.api}${api.endpoint}`;

const insertElement = (obj) => {
  obj.forEach((itens) => {
    const tag = createProductItemElement(itens);
    document.querySelector('.items').appendChild(tag);
    tag.lastElementChild.addEventListener('click', () => {
      const endPoint = tag.firstElementChild.innerText;
      fetch(`${requiredUrl}${endPoint}`)
      .then(response => response.json())
      .then((getResponse) => {
        const cartList = createCartItemElement(getResponse);
        document.querySelector('.cart__items').appendChild(cartList);
      });
    });
  });
};

const fetchObj = () => {
  fetch(url)
  .then(response => response.json())
  .then((jsonResponse) => {
    console.log(jsonResponse.results);
    insertElement(jsonResponse.results);
  });
};

window.onload = function onload() {
  fetchObj();
};
