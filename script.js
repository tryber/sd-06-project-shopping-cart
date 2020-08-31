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

function listElements(arrResults) {
  // console.log(arrResults[0].id);
  arrResults.forEach((product) => {
    const sku = product.id;
    const name = product.title;
    const image = product.thumbnail;

    const secItems = document.querySelector('.items');
    secItems.appendChild(createProductItemElement({ sku, name, image }));
  });
}

const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function fetchMLB(url) {
  fetch(url)
  .then(response => response.json())
  .then(data => listElements(data.results))
  .catch(error => window.alert(error));
}

window.onload = () => fetchMLB(urlAPI);

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
