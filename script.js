function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.alt = 'Product_img';
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

function addClickedItemToCart(element) {
  document
    .querySelector('.cart__items')
    .appendChild(element);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getAPIdata() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  let products;

  await fetch(url)
    .then((res) => res.json())
    .then((resJson) => {
      products = resJson.results;
    })
    .catch((err) => console.log(err));

  console.log(products);

  return products;
}

async function buildProductsOnScreen() {
  const container = document.querySelector('.items');

  const products = await getAPIdata();

  products.forEach((product) => {
    const {
      id: sku, title: name, thumbnail: image, price: salePrice,
    } = product;

    const productElement = createProductItemElement({ sku, name, image });
    const futureCartItem = createCartItemElement({ sku, name, salePrice });

    productElement
      .querySelector('.item__add')
      .addEventListener('click', () => {
        addClickedItemToCart(futureCartItem);
      });

    container.appendChild(productElement);
  });
}

window.onload = function onload() {
  buildProductsOnScreen();
};
