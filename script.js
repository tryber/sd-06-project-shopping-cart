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

// tirar duvida do obj distruct
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
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

// mark add <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// função de erro, caso de erro
const handleError = (errorMessage) => {
  window.alert(errorMessage);
}

// construção da api url
const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/search?q=$',
  endpoint: 'computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}`;

// função fetch para pegar o obj do api do mercado livre
const fetchCurrency = (currency) => {
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      console.log(object);
      if (object.error) {
        throw new Error(object.error);
      } else {
        console.log(object.results);
        // caminha na array object.results
        object.results.forEach((item) => {
          // seleciona a section com id items e vai add p/ cada elemento da array
          // (cont) o return da função createProductItemElement.
          // o parametro item é o objeto gerado pela array object.results
          document.querySelector('.items')
          // tirar duvida do obj distruct
          .appendChild(createProductItemElement(item));
          console.log(item.title);
        });
      }
    })
    .catch(error => handleError(error));
}

window.onload = function onload() {
  fetchCurrency();
};
