const apiURL = {
  url: 'https://api.mercadolibre.com/',
  endPointProduct: 'sites/MLB/search?q=',
  search: 'computador',
  endPointItem: 'items/',
};

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cartOl = document.querySelector('.cart__items');
  cartOl.appendChild(li);
  console.log(cartOl.appendChild(li));
  return li;
}

async function fetchItemsID(itemID) {
  const itemURL = `${apiURL.url}${apiURL.endPointItem}${itemID}`;
  await fetch(itemURL)
    .then(response => response.json())
    .then((resultJSON) => {
      createCartItemElement(resultJSON.id, resultJSON.title, resultJSON.price);
    })
    .catch(error => window.alert(error));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function renderCartItem(event) {
  const itemID = event.target.parentNode.children[0].innerText;
  fetchItemsID(itemID);
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', renderCartItem);
  section.appendChild(button);
  return section;
}

function listReturned(arrOfProducts) {
  arrOfProducts.map((element) => {
    const secItems = document.querySelector('.items');
    return secItems.appendChild(createProductItemElement(element.id, element.title, element.thumbnail));
  });
}

function fetchItems() {
  const productURL = `${apiURL.url}${apiURL.endPointProduct}${apiURL.search}`;
  fetch(productURL)
    .then(response => response.json())
    .then((resultJSON) => {
      const result = resultJSON.results;
      listReturned(result);
    })
    .catch(error => window.alert(error));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  fetchItems();
};
