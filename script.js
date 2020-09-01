

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

function cartItemClickListener(event) {
  const productList = document.querySelector('.cart__items');
  const itemSelected = event.target;
  productList.removeChild(itemSelected);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartItem(event) {
  const itemID = event.path[1].childNodes[0].innerHTML;
  const url = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(url)
  .then(response => response.json())
  .then((product) => {
    const productFormated = {
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    };
    const shoppingCartList = document.querySelector('.cart__items');
    shoppingCartList.appendChild(createCartItemElement(productFormated));
  });
}

function createItemList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
  .then(response => response.json())
  .then(data => data.results.forEach((product) => {
    const productFormated = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    const newProduct = createProductItemElement(productFormated);
    newProduct.addEventListener('click', addCartItem);
    const productList = document.querySelector('.items');
    productList.appendChild(newProduct);
  }));
}

function clearList() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = '';
}

window.onload = function onload() {
  createItemList();

  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', clearList);
};
