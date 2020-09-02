

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

// criando requisição - requisito 2 - escutar o click da função createCartItemElement com o id
function itemRequest(event) {
  const url = 'https://api.mercadolibre.com/items/';
  id = event.target;
  const urlItem = `${url}${id}`;
  fetch(urlItem)
  .then(response => response.json())
  .then((response) => {
    const idObj = { 
      id:response.results.id,
      title: response.results.title,
      price: response.results.price
      };
    return idObj;
  });
}

// usada para remover algum item do carrinho
function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(event.target);
}

async function createCartItemElement(event) {
  console.log(event)
  const { id, title, price } = await itemRequest(event);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  document.querySelector('.cart__items').appendChild(li);
  li.addEventListener('click', cartItemClickListener);

  return li;
}

// req 1
function createProductItemElement({ sku, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', createCartItemElement);

  // return section;
  document.querySelector('.items').appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// criando requisição - requisito 1
function computerRequest() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return fetch(url)
    .then(response => response.json())
    .then(response => response.results)
    .then(response => response.forEach((element) => {
      const newObj = {
        sku: element.id,
        title: element.title,
        thumbnail: element.thumbnail
      }
      createProductItemElement(newObj);
      return newObj;
    }));
}

window.onload = function onload() {
  computerRequest();
};
