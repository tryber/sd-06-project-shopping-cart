// pegando a API
const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

// é chamada pela função filterElementsObjectApi
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

// função para olhar dentro do object.result e criar os subitens de .items
const filterElementsObjectApi = (elementsArray) => {
  elementsArray.forEach((element) => {
    const arrayProducts = document.querySelector('.items');
    arrayProducts.appendChild(createProductItemElement(element));
  });
};

// função para chamar a API
const handleAPI = () => {
  fetch(url)
  .then(response => response.json())
  .then((object) => {
    console.log(object);
    const objectNew = object.results;
    console.log(object.results);
    filterElementsObjectApi(objectNew);
  });
};

window.onload = function onload() {
  handleAPI();
};
