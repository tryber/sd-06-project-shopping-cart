const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

const fetchProducts = () => {
  fetch(url)
    .then(response => response.json())
    .then((response) => {
      response.results.forEach((element) => {
        const product = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        document.querySelector('.items').appendChild(product);
      });
      handleButtonsAddtoCart();
    });
};

const fetchOneProduct = (id) => {
  const endpoint = 'https://api.mercadolibre.com/items/';
  fetch(`${endpoint}${id}`)
    .then(response => response.json())
    .then((response) => {
      const product = createCartItemElement({
        sku: response.id,
        name: response.title,
        salePrice: response.price,
      });
      document.querySelector('.cart__items').appendChild(product);
    });
};

const handleButtonsAddtoCart = () => {
  document.querySelectorAll('.item__add').forEach(element =>
  element.addEventListener('click', (event) => {
    const id = event.target.parentNode.querySelector('span.item__sku').innerText;
    fetchOneProduct(id);
  }));
};

window.onload = function onload() {
  fetchProducts();
};
