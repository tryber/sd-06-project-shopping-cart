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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  document.querySelector('.items').appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
} */

/* function createCartItemElement({ id, title, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = ` SKU: ${id} | NAME: ${title} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

const ML_URL = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(resp => resp.json())
    .then(data => data.results.forEach(result => createProductItemElement(result)));
};

window.onload = function onload() {
  ML_URL();
};
