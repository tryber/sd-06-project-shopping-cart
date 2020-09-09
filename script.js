//Window.onload = function onload() { };
const endpointURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

//Saving into local storage
const saveFunction = () => {
  const items = document.querySelector('.cart__items').innerHTML;// selecting from html
  localStorage.setItem('cart', items);// saving at local storage
};

//Removing item
function cartItemClickListener(event) {
  const list = event.target;
  event.target.remove();// removing where the mouse is pointing
  const total = document.querySelector('.total-price');// taking from html
  const itemPrice = parseFloat(list.innerText.split('$')[1]);
  const totalPrice = parseFloat(total.innerHTML);
  const result = totalPrice - itemPrice;
  total.innerText = result;
  saveFunction();
}

//Sum of all items
async function sumPrice(list) { // creating an async function for the list
  const total = document.querySelector('.total-price');
  const itemPrice = parseFloat(list.innerText.split('$')[1]);
  const totalPrice = parseFloat(total.innerHTML);
  const result = itemPrice + totalPrice;
  total.innerText = result;
  saveFunction();
}

//Creating the selected items from the cart
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const list = document.createElement('li');
  list.className = 'cart__item';
  list.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  saveFunction();
  sumPrice(list);
  list.addEventListener('click', cartItemClickListener);
  return list;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const sectionArea = document.createElement('section');
  const sectionAreaItems = document.querySelector('.items');
  sectionArea.className = 'item';
  sectionArea.appendChild(createCustomElement('span', 'item__sku', sku));
  sectionArea.appendChild(createCustomElement('span', 'item__title', name));
  sectionArea.appendChild(createProductImageElement(image));
  sectionArea.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      const url = sku;
      fetch(`https://api.mercadolibre.com/items/${url}`)
        .then(response => response.json())
        .then((result) => {
          const createdItem = createCartItemElement(result);
          const ol = document.querySelector('.cart__items');
          ol.appendChild(createdItem);
          saveFunction();
        });
    });
  sectionAreaItems.appendChild(sectionArea);

  return sectionArea;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchingFunction() {
  setTimeout(() =>
  fetch(endpointURL)
    .then(response => response.json())
    .then(object => object.results)
    .then(result => result
      .forEach(resultElement => createProductItemElement(resultElement))),
      1000);
}

//Clear button
const clear = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    const total = document.querySelector('.total-price');
    total.innerText = 0;
    functionSave();
  });
};

//Salving at local storage
const savingAtLocalStorage = () => {
  if (localStorage.cartShop) document.querySelector('.cart__items').innerHTML = localStorage.cartShop;
};

const loadFile = () => {
  setTimeout(() => {
    const load = document.querySelector('.loading');
    load.remove();
  }, 1000);
};

window.onload = function onload() {
  fetchingFunction();
  clear();
  savingAtLocalStorage();
  loadFile();
};
// fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
// .then(response => response.json())
// .then((response) => {
//   console.log(response.results);
//   response.results.forEach((item) => {
//     const product = createProductItemElement({
//       sku: item.id,
//       name: item.title,
//       image: item.thumbnail,
//     });
//     document.querySelector('.items').appendChild(product);
//   });
// });
// const fetching = () => {
//   const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=$${searchValue}`;
//   const searchValue = 'computador';
//   fetch(endPoint)
//   .then((response) => response.json())
//   .then((response) => {
//     response.results.forEach((item) => {
//       const products = createCartItemElement({
//         sku: item.id,
//         name: item.title,
//         image: item.thumbnail,
//       });
//       document.querySelector('items').appendChild(products);
//     });
//   });
//   .then(() => clearCartButton())
//   .then(() => loadCartSaved())
//   .then(() => document.querySelector('.loading').remove());
// };


//   img.src = imageSource;
//   return img;
// }

// function createCustomElement(element, className, innerText) {
//   const e = document.createElement(element);
//   e.className = className;
//   e.innerText = innerText;
//   return e;
// }

// function createProductItemElement({ sku, name, image }) {
//   const section = document.createElement('section');
//   section.className = 'item';

//   section.appendChild(createCustomElement('span', 'item__sku', sku));
//   section.appendChild(createCustomElement('span', 'item__title', name));
//   section.appendChild(createProductImageElement(image));
//   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

//   return section;
// }

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
