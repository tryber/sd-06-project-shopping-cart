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

function cartItemClickListener(event) {
  const aux = event.target;
  aux.remove();
}

function removeItem() {
  const clearOptions = document.querySelectorAll('.cart__item');
  const ol = document.querySelector('.cart__items');
  clearOptions.forEach((index) => {
    ol.removeChild(index);
  });
  localStorage.setItem('cartList', clearOptions.innerHTML);
  console.log(localStorage.getItem('cartList'));
}

function clearList() {
  const clearListItem = document.querySelector('.empty-cart');
  clearListItem.addEventListener('click', removeItem);
  localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML);
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
    if (object.error) {
      throw new Error(object.error);
    }
    const arrayComputer = object.results;
    console.log(arrayComputer);
    handlersectionsComputer(arrayComputer);
    document.querySelector('.cart__items').appendChild(createCartItemElement(object));
  })
  .then(() => localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML))
  .catch(error => window.alert(error));
}

window.onload = function onload() {
  clearList();
  removeItem();
  handlerStrutor();
};
