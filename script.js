window.onload = function onload() {
  const URL = `${apiURL.url}${apiURL.endPoint}${apiURL.search}`;
  fetch(URL)
    .then(response => response.json())
    .then((resultJSON) => {
      const result = resultJSON.results;
      listReturned(result);
    })
    .catch(error => window.alert(error));
};

const apiURL = {
  url: 'https://api.mercadolibre.com/',
  endPoint: 'sites/MLB/search?q=',
  search: 'computador'
}

function listReturned(arrOfProducts) {
  arrOfProducts.forEach((element) => {
    const secItems = document.querySelector('.items');
    secItems.appendChild(createProductItemElement(element.id, element.title, element.thumbnail))
  });

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

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';
  // console.log(name)
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  console.log(section);
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
