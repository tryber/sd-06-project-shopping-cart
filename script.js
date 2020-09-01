window.onload = function onload() { };

// const api = 'https://api.mercadolibre.com/sites/MLB/search?q=';
// const endpoint = '$computador';
// const url = `${api}${endpoint}`;


// const handleObjects = (objects) => {
//   console.log(objects);
//   console.log('---------------------------------------');
//   const arrayOfItems = {
//     sku: objects.id,
//     name: objects.name,
//     salePrice: objects.salePrice
//   };
//   console.log(arrayOfItems);
// }
// .then((object) => handleObjects(object.results));

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

const apiSearch = () => {
  fetch('https:api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json())
    .then((response) => {
      const resultsOfResponse = response.results;
      resultsOfResponse.forEach((item) => {
        const arrayOfItems = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        console.log(arrayOfItems);
        document.querySelector('.items').appendChild(arrayOfItems);
      });
    });
};

window.onload = () => {
  apiSearch();
};
