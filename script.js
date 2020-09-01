const urlEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

const saveStorage = () => {
  const items = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', items);
};

const sumPrices = async (li) => {
  const total = document.querySelector('.total-price');
  const itemPrice = parseFloat(li.innerText.split('$')[1]);
  const totalPrice = parseFloat(total.lastChild.innerHTML);
  const sum = itemPrice + totalPrice;
  total.lastChild.innerText = sum;
};

function cartItemClickListener(event) {
  const section = document.querySelector('.cart__items');
  const item = event.target;
  section.removeChild(item);
  saveStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  sumPrices(li);
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    const id = sku;
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then(response => response.json())
      .then((result) => {
        const createItem = createCartItemElement(result);
        const list = document.querySelector('.cart__items');
        list.appendChild(createItem);
        saveStorage();
        sumPrices();
      });
  });
  items.appendChild(section);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const fetchFunction = () => {
  fetch(urlEndpoint)
    .then(response => response.json())
    .then(object => object.results)
    .then(result => result.forEach(element => createProductItemElement(element)));
};

const clear = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const section = document.querySelector('.cart__items');
    section.innerHTML = '';
  });
  saveStorage();
  sumPrices(li);
};

const storageItems = () => {
  if (localStorage.cart) {
    document.querySelector('.cart__items').innerHTML = localStorage.cart;
  }
};

window.onload = function onload() {
  fetchFunction();
  clear();
  storageItems();
};
