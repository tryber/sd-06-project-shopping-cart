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
  const list = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  list.appendChild(li);
  return li;
}

const insertCart = (position) => {
  const api = 'https://api.mercadolibre.com/items/';
  const item = document.querySelectorAll('.item__add');
  const info = document.querySelectorAll('.item');
  item[position].addEventListener('click', () => {
    const endpoint = getSkuFromProductItem(info[position]);
    fetch(`${api}${endpoint}`)
      .then(response => response.json())
      .then((obj) => {
        const { id, title, price } = obj;
        createCartItemElement({
          sku: id,
          name: title,
          salePrice: price,
        });
      });
  });
};

const clearCart = () => {
  const clear = document.querySelector('.empty-cart');
  clear.addEventListener('click', () => {
    const items = document.querySelector('.cart__items');
    items.innerHTML = '';
  });
};

const fetchItems = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((obj) => {
      console.log(obj.results);
      obj.results.forEach((items, i) => {
        const { id, title, thumbnail } = items;
        const products = createProductItemElement({
          sku: id,
          name: title,
          image: thumbnail,
        });
        document.querySelector('.items').appendChild(products);
        insertCart(i);
      });
    });
};

window.onload = function onload() {
  fetchItems();
  clearCart();
};
