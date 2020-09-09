const endpoint = {
  api: 'https://api.mercadolibre.com/',
  endpointAll: 'sites/MLB/search?q=computador',
  endpointOnly: 'items/',
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// function addEventButtonAddCart() {
//   const buttonAddCart = document.querySelectorAll('.item__add');
//   buttonAddCart.forEach(button => {
//     button.addEventListener('click', function () {
//       fetchOnlyItem();
//     });
//   });
// }

function cartItemClickListener(event) {
  // remove elemento li
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem() {
  // document.querySelector('.item');
  const item = event.target.parentElement;// parentElem encontra elemento pai do evento
  return item.querySelector('span.item__sku').innerText; // elemento pai extrai o filho especificado
}

const fetchOnlyItem = () => {
  const id = getSkuFromProductItem();
  const urlEndpoint = `${endpoint.api}${endpoint.endpointOnly}${id}`;
  fetch(urlEndpoint)
    .then(response => response.json())
    .then((object) => {
      const objectResult = object;
      if (object.error) {
        throw new Error(object.error);
      } else {
        const elementOl = document.querySelector('.cart__items');
        const elementLi = createCartItemElement(objectResult);
        elementOl.appendChild(elementLi);
        // salva no local storage; depois
      }
    })
    .catch(error => console.log('errou')); // func que trata error
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', fetchOnlyItem);
  }
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
  const containerItem = document.querySelector('.items');
  containerItem.appendChild(section);
  return section;
}

const fetchAllItems = () => {
  const urlEndpoint = `${endpoint.api}${endpoint.endpointAll}`;
  fetch(urlEndpoint)
    .then(response => response.json())
    .then((object) => {
      const objectResult = object.results;
      if (object.error) {
        throw new Error(object.error);
      } else {
        objectResult.forEach(data => createProductItemElement(data)); // um objeto
      }
    })
    .catch(error => console.log('errou')); // func que trata error
};

window.onload = function onload() {
  fetchAllItems();
};
