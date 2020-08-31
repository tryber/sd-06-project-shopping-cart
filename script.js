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
  const cartElements = document.querySelector('.cart__items');
  cartElements.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchItemBySKU = (sku) => {
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  const cartElements = document.querySelector('.cart__items');

  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      cartElements
        .appendChild(createCartItemElement({
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        }));
    });
};

const fetchItems = (query = 'computador') => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const sectionItems = document.querySelector('.items');

  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const products = data.results;
      const items = products.map((prod) => {
        const item = createProductItemElement({
          sku: prod.id,
          name: prod.title,
          image: prod.thumbnail,
        });
        sectionItems.appendChild(item);

        return item;
      });
      return items;
    })
    .then((items) => {
      items.forEach((i) => {
        i.children[3].addEventListener('click', () => {  // botao de adicionar carrinho
          fetchItemBySKU(getSkuFromProductItem(i));
        });
      });
    });
};

window.onload = function onload() { fetchItems(); };
