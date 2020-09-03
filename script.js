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

function removeItem() {
  const cartItems = document.querySelectorAll('.cart__item');
  const ol = document.querySelector('.cart__items');
  for (let index = 0; index < cartItems.length; index += 1) {
    ol.removeChild(cartItems[index]);
  }
}
function clearList() {
  const clearListItem = document.querySelector('.empty-cart');
  clearListItem.addEventListener('click', removeItem);
  clearListItem.addEventListener('click', function () {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.setItem('cartItemsSaved', '');
  });
}
let totalprice = 0;
const getPrice = text => Number(text.slice(text.indexOf('$') + 1));

const totalPrice = (price) => {
  totalprice -= Math.round(price * 100) / 100;
  document.querySelector('.total-price').innerText = `${Math.round(totalprice * 100) / 100}`;
};

function cartItemClickListener(event) {
  const aux = event.target;
  aux.remove();
  totalPrice(getPrice(clickedItem.innerText));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// quesito dois, ajuda de Willan Gomes
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(index => index.json())
    .then((index) => {
      const item = createCartItemElement({
        sku: index.id,
        name: index.title,
        salePrice: index.price,
      });
      document.querySelector('.cart__items').appendChild(item);
      const saveCart = document.querySelector('.cart__items');
      localStorage.setItem('cartItemsSaved', saveCart.innerHTML);
    });
  });
  return section;
}
function handlersectionsComputer(arrayComputer) {
  arrayComputer.forEach((product) => {
    const productNewPay = createProductItemElement(product);
    const section = document.querySelector('.items');
    section.appendChild(productNewPay);
  });
}
function handlerStrutor() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computer';
  fetch(url)
.then(response => response.json())
.then((object) => {
  const arrayComputer = object.results;
  console.log(arrayComputer);
  handlersectionsComputer(arrayComputer);
});
}

const saveStorage = () => {
  const saveCart = document.querySelector('.cart__items');
  console.log(saveCart.innerHTML);
  localStorage.setItem('cartItemsSaved', saveCart.innerHTML);
};

const loadStorage = () => {
  const saveCart = document.querySelector('.cart__items');
  if (localStorage) {
    saveCart.innerHTML = localStorage.getItem('cartItemsSaved');
  }
};


window.onload = function onload() {
  clearList();
  removeItem();
  handlerStrutor();
  loadStorage();
  saveStorage();
};
