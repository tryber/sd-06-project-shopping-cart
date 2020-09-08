// window.onload = function onload() { };
const Endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  return e;
}

// saving into local storage
const saveFunction = () => {
  const items = document.querySelector('.cart__items').innerHTML;// selecting from html
  localStorage.setItem('cart', items);// saving at local storage
};

// removing item
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
