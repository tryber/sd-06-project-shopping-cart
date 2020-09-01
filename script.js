let acc = 0;
const newAr = [];
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
  const list = document.querySelector('#cart-items');
  list.removeChild(event.target);
  const value = event.target.innerText.split('$')[1];
  const id = event.target.innerText.split(' ')[1];
  const price = document.querySelector('#pricesT');
  acc -= parseFloat(value);
  localStorage.setItem('total', acc.toFixed(2));
  newAr.forEach((el, index) => {
    if (newAr[index] !== null && el.sku === id) {
      newAr[index] = null;
    }
  });
  localStorage.setItem('carrinho', JSON.stringify(newAr));
  price.innerText = `Preço total: $${(localStorage.total) ? localStorage.total : acc.toFixed(2)}`;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const APIReq = () => {
  const items = document.querySelector('#item');
  items.innerHTML = "<h1 class='loading'>Loading...</h1>";
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then(res => res.json())
  .then((data) => {
    items.innerHTML = '';
    data.results.map(el => items.appendChild(createProductItemElement({
      sku: el.id, name: el.title, image: el.thumbnail })));
  });
};


async function addItems(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const price = document.querySelector('#pricesT');
  await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(res => res.json())
  .then((data) => {
    if (data.error) {
      throw new Error(data.error);
    }
    const cartItems = document.querySelector('#cart-items');

    cartItems.appendChild(createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price }));
    acc += data.price;
    localStorage.setItem('total', acc);
    price.innerText = `Preço total: $${(localStorage.total) ? localStorage.total : acc.toFixed(2)}`;

    const obj = {
      sku: data.id,
      name: data.title,
      salePrice: data.price };
    newAr.push(obj);
    localStorage.setItem('carrinho', JSON.stringify(newAr));
  }).catch(() => console.log('erro ocorrido'));
}

window.onload = function onload() {
  APIReq();
  const cartItem = document.querySelector('#cart-items');
  document.querySelector('#item').addEventListener('click', addItems);
  const price = document.querySelector('#pricesT');
  document.querySelector('#getEmpy').addEventListener('click', () => {
    localStorage.clear();
    cartItem.innerHTML = '';
    price.innerText = `Preço total: $${0}`;
    localStorage.setItem('total', 0);
  });
  if (localStorage.carrinho && localStorage.total) {
    const arrayN = JSON.parse(localStorage.carrinho);
    arrayN.map((el, index) => {
      if (arrayN[index] !== null) {
        const objt = {
          sku: el.sku,
          name: el.name,
          salePrice: el.salePrice,
        };
        return cartItem.appendChild(createCartItemElement(objt));
      }
      return true;
    });
    price.innerText = `Preço total: $${parseFloat(localStorage.total).toFixed(2)}`;
  }
};
