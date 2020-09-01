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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function includeInCart(e) {
  const idInclude = getSkuFromProductItem(e.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${idInclude}`)
      .then(response => response.json())
      .then(({ id, title, price }) => {
        const cart = document.getElementsByClassName('cart__items')[0];
        cart.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
      });
}

function mercadoLivreProdcts() {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(api)
    .then(response => response.json())
    .then(data => data.results)
    .then((eachData) => {
      eachData.forEach(({ id, title, thumbnail }) => {
        const section = document.getElementsByClassName('items')[0];
        const elements = createProductItemElement({ sku: id, name: title, image: thumbnail });
        elements.addEventListener('click', includeInCart);
        section.appendChild(elements);
      });
    });
}

window.onload = function onload() {
  mercadoLivreProdcts();
};
