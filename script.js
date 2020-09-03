// function loading() {
//   setTimeout(document.querySelector('.loading').remove(), 2000);
// }

function allocateLStorage() {
  const cart = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cartItems', cart.innerHTML);
}

function emptyCart() {
  document.getElementsByClassName('cart__items')[0].innerHTML = '';
  localStorage.setItem('cartItems', '');
  allocateLStorage();
}

function reloadLStorage() {
  if (localStorage.cartItems) {
    document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.cartItems;
  }
  const buttonEmptyCart = document.getElementsByClassName('empty-cart')[0];
  buttonEmptyCart.addEventListener('click', emptyCart);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const cartItemClickList = document.querySelector('.cart__items');
  cartItemClickList.removeChild(event.target);
  allocateLStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// adicionado
function buttonAddCart(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(function (response) {
      if (!response.ok) throw new Error('Erro de requisição');
      return response.json();
    })
    .then((response) => {
      const carI = document.querySelector('.cart__items');
      const newI = createCartItemElement({
        sku: response.id,
        name: response.title,
        salePrice: response.price,
      });
      carI.appendChild(newI);
      allocateLStorage();
    })
    .catch(function (Error) {
      return Error;
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const buttonAddInCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(buttonAddInCart);
  buttonAddInCart.addEventListener('click', function () {
    buttonAddCart(sku);
  });
  allocateLStorage();
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// adicionado
const apiSite = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const apiFetch = async function () {
  setTimeout(document.querySelector('.loading').remove(), 2000);
  return fetch(apiSite)
  .then(function (response) {
    if (!response.ok) throw new Error('Erro de requisição');
    return response.json();
  })
  .then(function ({ results }) {
    results.forEach(function (v) {
      // const prodIE = createProductItemElement({ sku: v.id, name: v.title, image: v.thumbnail });
      const itemInSe = document.querySelector('.items');
      itemInSe.appendChild(createProductItemElement({
        sku: v.id,
        name: v.title,
        image: v.thumbnail,
      }));
    });
  })
  .catch(function (Error) {
    return Error;
  });
};

window.onload = () => {
  // loading();
  apiFetch();
  reloadLStorage();
};

/*
PRINCIPAIS REFERENCIAS
GITHUB CONSULTADOS:
ANDERSSON STUBER, HAVYNER CAETANO, ISADORA KOGA.

OUTROS SITES:
https://developer.mozilla.org
https://www.w3schools.com
https://medium.com
https://www.devmedia.com.br
https://pt.stackoverflow.com

YOUTUBE = "tantaum de canal"

DESENVOLVIDO COM O APOIOD DE:
ANDERSSON STUBER, ANDRÉ POSSAS, LUCIVAL DOS SANTOS(LUGH), PAULO LINS, RICHARD WELLERSON.

AGRADECIMETNOS ESPECIAIS:
ANDERSSON STUBER QUE ME AJUDOU DO INCIO AO FIM DO PROJETO!(mais uma vez)
*/
