const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search?q=$computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}`;
console.log(url);

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(response => response.json())
        .then((object) => {
          const chosenProduct = createCartItemElement({
            sku: object.id,
            name: object.title,
            salePrice: object.price,
          });
          const olList = document.querySelector('.cart__items');
          olList.appendChild(chosenProduct);
        });
    });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const urlfetch = () => {
  fetch(url)
    .then(response => response.json())
    .then((response) => {
      response.results.forEach((indice) => {
        const merchandise = createProductItemElement({
          sku: indice.id,
          name: indice.title,
          image: indice.thumbnail,
        });
        document.querySelector('.items').appendChild(merchandise);
      });
    });
};

window.onload = function onload() {
  urlfetch();
};
