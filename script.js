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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const APIReq = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then(res => res.json())
  .then((data) => {
    const items = document.querySelector('#item');
    data.results.map(el => items.appendChild(createProductItemElement({
      sku: el.id, name: el.title, image: el.thumbnail })));
  });
};

function addItems(event) {
  const id = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${id}`)
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
  }).catch(() => console.log('erro ocorrido'));
}

window.onload = function onload() {
  APIReq();
  const items = document.querySelector('#item');
  items.addEventListener('click', addItems);
};
