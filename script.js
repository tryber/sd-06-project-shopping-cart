const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, Title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener(li));
  return li;
}

function clickButton(event) {
  const itemId = event.path[1].childNodes[0].innerHTML;
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const carItem = createCartItemElement(object);
      const ol = document.querySelector('.car_items');
      ol.appendChild(carItem);
    });
}

function renderItems(arrayResults) {
  arrayResults.forEach((element) => {
    const newItem = createCartItemElement(element);
    const section = document.querySelector('.items');
    section.appendChild(newItem).addEventListener;('click', clickButton);
  });
}

const fetchProductList = () => {
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      const result = object.results;
      renderItems(result);
    });
};

window.onload = function onload() {
  fetchProductList(url);
  
};
