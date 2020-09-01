window.onload = function onload() { };
const itemsArray = await itemsList('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
.then((arr) => {
  arr.map()
}
);


async function itemsList (url)  {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=$computador') {
   return fetch(url)
   .then(r => r.json())
   .then(r => r.results);
   } else {
     throw new Error(error);
   }
}

// function createProductImageElement(imageSource) {
//   const img = document.createElement('img');
//   img.className = 'item__image';
//   img.src = imageSource;
//   return img;
//   //"thumbnail"
// }

// function createCustomElement(element, className, innerText) {
//   const e = document.createElement(element);
//   e.className = className;
//   e.innerText = innerText;
//   return e;
// }

itemsArray.forEach(element => {
  let sku = element.id;
  let name = element.title;
  let image = element.thumbnail;
  createProductItemElement(sku, name, image);
});

function createProductItemElement({ sku, name, image }) {
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
//   document.getElementById
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
