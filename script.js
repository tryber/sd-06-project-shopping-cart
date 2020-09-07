const apiInfo = {
  api: 'https://api.mercadolibre.com/sites/MLB/',
  endpoint: 'search?q=$computador',
};

const url = `${apiInfo.api}${apiInfo.endpoint}`;
console.log(url);

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

function saveProductLocalStorage(product) {
  let cart = localStorage.getItem('cart');
  if (!cart) {
    cart = [];
  } else {
    cart = JSON.parse(cart);
  }
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
}

function totalValueOfItems(price) {
  const span = document.querySelector('.total-price');
  span.innerHTML = price;
}

function sumTotalFromStore() {
  const cart = JSON.parse(localStorage.getItem('cart'));

  let sumItems = 0;

  if (cart) {
    cart.forEach((product) => {
      sumItems += product.salePrice;
    });
  }

  totalValueOfItems(sumItems);
}

function cartItemClickListener(event, sku) {
  // coloque seu código aqui
  const selectedProduct = event.target;
  const listOl = document.querySelector('.cart__items');
  listOl.removeChild(selectedProduct);

  const cart = JSON.parse(localStorage.getItem('cart'));
  if (cart) {
    const updatedCart = cart.filter(product => product.sku !== sku);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }
  sumTotalFromStore();
}
// let cart = JSON.parse(localStorage.getItem('cart'));
// if (cart) {
//   const newCart = [];
//   for (let i = 0; i < cart.length; i += 1) {
//     if (cart[i].sku !== sku) {
//       newCart.push(cart[i]);
//     }
//   }
//   localStorage.setItem('cart', JSON.stringify(newCart));
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', function () {
    cartItemClickListener(event, sku);
  });
  return li;
}

function restoreLocalStorage() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  if (cart) {
    for (let i = 0; i < cart.length; i += 1) {
      const restore = cart[i];
      const searchProduct = createCartItemElement(restore);
      const olList = document.querySelector('.cart__items');
      olList.appendChild(searchProduct);
    }
  }
  sumTotalFromStore();
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
        .then((object) => {
          const product = {
            sku: object.id,
            name: object.title,
            salePrice: object.price,
          };
          const chosenProduct = createCartItemElement(product);
          const olList = document.querySelector('.cart__items');
          olList.appendChild(chosenProduct);
          saveProductLocalStorage(product);
          sumTotalFromStore();
        });
    });
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const urlfetch = () => {
  fetch(url)
    .then(response => response.json())
    .then((response) => {
      response.results.forEach((indice) => {
        const merchandise = createProductItemElement({
          sku: indice.id,
          name: indice.title,
          image: indice.thumbnail,
        });
        document.querySelector('.items').appendChild(merchandise);
      });
      document.getElementById('loading').remove();
    });
};

function emptyCart() {
  document.getElementById('cart__items').innerHTML = '';
  localStorage.removeItem('cart');
  sumTotalFromStore();
}

window.onload = function onload() {
  urlfetch();
  restoreLocalStorage();
};
