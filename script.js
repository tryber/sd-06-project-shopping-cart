window.onload = function onload() { };

const data = fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then(response => response.json())
  .then((response) => createMyObject(response));

function createMyObject(object) {
  object.results.forEach(result => {
    myObject = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    }
    postElementinSection(myObject);
  });
}

function postElementinSection(object) {
  const mySection = document.getElementsByClassName('items')[0];
  mySection.appendChild(createProductItemElement(myObject));
}

// fetch(endpoint)
// .then((response) => response.json())
// .then((object) => {
//   if (object.error) {
//     throw new Error(object.error);
//   } else {
//     handleRates(object.rates);
//   }
// })
// .catch((error) => handleError(error))

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui. Ok!
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
