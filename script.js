function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(this);
}

function clearCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const cartList = document.querySelector('.cart__items');
    while(cartList.firstChild) {
      cartList.removeChild(cartList.lastChild)
    }
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function queryThisAtML(sku) {
  const queryUrl = `https://api.mercadolibre.com/items/${sku}`;
  fetch(queryUrl)
    .then(response => response.json())
    .then((response) => {
      const cartItems = document.querySelector('.cart__items');
      const Item = createCartItemElement({
        sku: response.id,
        name: response.title,
        salePrice: response.price,
      });
      cartItems.appendChild(Item);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const thisButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  thisButton.addEventListener('click', () => queryThisAtML(sku));
  section.appendChild(thisButton);

  return section;
}

function queryAtML() {
  const queryUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(queryUrl)
    .then(response => response.json())
    .then(response => response.results)
    .then((items) => {
      items.forEach(item => document.querySelector('.items')
        .appendChild(createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        })));
    });
}

window.onload = () => {
  queryAtML();
  clearCart();
};
