const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search?q=',
  query: '$computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}${apiInfo.query}`;

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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const handleError = (errorMessage) => {
  window.alert(errorMessage);
};

const fetchByIDComputer = (endpointParameter) => {
  fetch(endpointParameter)
    .then(response => response.json())
    .then((object) => {
      const itemOnCart = createCartItemElement ({
        sku: object.id,
        name: object.title,
        salePrice: object.price,
      });
      const newItemOnCart = document.querySelector('.cart__items');
      newItemOnCart.appendChild(itemOnCart);
    })
    .catch(error => handleError(error));
};

const handleButtonClick = () => {
  const pageIds = document.querySelectorAll('.item__sku');
  const pageButtons = document.querySelectorAll('.item__add');
  const endPoint = 'https://api.mercadolibre.com/items/';
  pageButtons.forEach((element, index) => {
    element.addEventListener('click', () => {
      const myId = pageIds[index].innerText;
      const myEndPoint = `${endPoint}${myId}`;
      fetchByIDComputer(myEndPoint);
    });
  });
};

const fetchComputer = () => {
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((element) => {
        const item = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        const newItem = document.querySelector('.items');
        const newSection = createProductItemElement(item);
        newItem.appendChild(newSection);
      });
    })
    .then(setTimeout(() => handleButtonClick(), 50))// Aguardar um tempo para chamar
    .catch(error => handleError(error));
};

window.onload = () => {
  fetchComputer();
};
