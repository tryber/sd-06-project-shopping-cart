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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sendItemtoCart = (product) => {
  const { id: sku, title: name, price: salePrice } = product;
  console.log(product);
  const itemToCart = createCartItemElement({ sku, name, salePrice });
  console.log(itemToCart);
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(itemToCart);
};

const computerObjectSearch = (inPutId) => {
  const productID = inPutId;
  console.log(productID);
  endpoint = `https://api.mercadolibre.com/items/${productID}`;
  // <span class="item__sku">MLB1532299476</span>
  console.log(endpoint);
  return fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      console.log(object);
      sendItemtoCart(object);
    });
};

const objectDetails = (productsArray) => {
  productsArray.forEach((elements) => {
    const section = document.querySelector('.items');
    const eachProductItem = createProductItemElement(elements);
    section.appendChild(eachProductItem);
    // console.log(eachProductItem);

    eachProductItem.lastChild.addEventListener('click', function () {
      // const { id: sku } = eachProductItem;
      // const idToSend = eachProductItem.results.sku;
      const idToSend = eachProductItem.firstChild.innerText;
      console.log(idToSend);
      computerObjectSearch(idToSend);
    });
  });
};

const itemSearch = () => {
  endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  return fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      // console.log(object);
      objectDetails(object.results);
    });
};

window.onload = function onload() {
  itemSearch();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
