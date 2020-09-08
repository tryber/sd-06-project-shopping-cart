function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
   addEventListener('click', () => {
    fetch('https://api.mercadolibre.com/items/${sku}')
    .then(data => data.json())
    .then((data => {
      const item = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.salePrice,
      });
      const olList = document.querySelector('.cart__items');
      olList.appendChild(item);
    }));
  });

  return section;
}
const fetchList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((response) => {
    response.results.forEach((item) => {
      const product = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      });
      document.querySelector('.items').appendChild(product);
    });
  });
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}*/

function cartItemClickListener(event) {
  const mainList = document.querySelector('.cart__items');
  mainList.removeChild(event.target);
} 

window.onload = function onload() {
  fetchList();
};
// teste