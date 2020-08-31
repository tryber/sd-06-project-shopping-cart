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

/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

// function cartItemClickListener(event) {
  // coloque seu código aqui
// }

/*
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
*/

const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function handleComputerObj(item) {
  const computerObj = {
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
  };
  return computerObj;
}

function fetchComputers() {
  fetch(url)
    .then((response => response.json()))
    .then((object) => {
      object.results.forEach((computer) => {
        document.querySelector('.items')
        .appendChild(createProductItemElement(handleComputerObj(computer)));
      });
    });
}

window.onload = function onload() {
  fetchComputers();
};
