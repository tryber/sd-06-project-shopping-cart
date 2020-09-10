window.onload = function onload() { };

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

async function totalSum() {
  const sectionTotalprice = document.querySelector('.total-price');
  const itensCart = document.querySelectorAll('.cart__item');
  let sumTotal = 0;
  itensCart.forEach((item) => {
    const price = Number(((item.innerHTML.split('$')[1]) * 100) / 100);
    sumTotal += price;
  });
  sectionTotalprice.innerHTML = sumTotal;
}

function upStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  const totalValue = document.querySelector('.total-price').innerHTML;
  localStorage.loadCart = cartItems;
  localStorage.total_price = totalValue;
}

function cartItemClickListener(event) {
  event.target.remove();
  upStorage();
  totalSum();
}

function loadStorage() {
  const innerStorage = document.querySelector('.cart__items');
  document.querySelector('.total-price').innerHTML = localStorage.total_price;
  if (localStorage.loadCart) {
    document.querySelector('.cart__items').innerHTML = localStorage.loadCart;
    innerStorage.addEventListener('click', cartItemClickListener);
  }
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('button').addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json())
    .then((data) => {
      const { id, title, price } = data;
      const addItem = createCartItemElement({ id, title, price });
      document.querySelector('.cart__items').appendChild(addItem);
      totalSum();
      upStorage();
    });
  });
  return section;
}

function clearCart() {
  const cartState = document.querySelector('.empty-cart');
  cartState.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerHTML = '';
  });
}

window.onload = async () => {
  const itemCart = document.querySelector('.items');
  const urlApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetch(urlApi)
  .then(res => res.json())
  .then((data) => {
    data.results.forEach((elemento) => {
      itemCart.appendChild(createProductItemElement(elemento));
    });
    document.querySelector('.loading').remove();
  });
  loadStorage();
  clearCart();
};
