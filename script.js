const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search?q=',
  query: '$computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}${apiInfo.query}`;

const handleError = (errorMessage) => {
  window.alert(errorMessage);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const localStorageSave = () => {
  const itemsOnCart = document.querySelector('.cart__items');
  localStorage.setItem('items', itemsOnCart.innerHTML);
};

const localStorageLoad = () => {
  const getCartItens = document.querySelector('.cart__items');
  const getCart = localStorage.getItem('items');
  getCartItens.innerHTML = getCart;
  getCartItens.addEventListener('dblclick', cartItemClickListener);
};

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
    .then((element) => {
      const item = createCartItemElement({
        sku: element.id,
        name: element.title,
        salePrice: element.price,
      });
      const itemList = document.querySelector('.cart__items');
      itemList.appendChild(item);
      localStorageSave();
    });
  });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  //  console.log(event.target); // retorna o elemento li todo
  //  let teste = event.target.innerText;
  //  let teste2 = localStorage.getItem('items');
  //  console.log(teste2)
  //  localStorage.removeItem('items', event.target); //passar para string
}

const fetchComputer = () => {
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((element) => {
        const item = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        document.querySelector('.items').appendChild(item);
      });
    })
    .then(() => localStorageLoad())
    .catch(error => handleError(error));
};

window.onload = () => {
  fetchComputer();
};
