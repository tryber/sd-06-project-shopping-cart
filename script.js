async function fetchContent(endepoint) {
  const response = await fetch(endepoint);
  const object = await response.json();
  object.result.forEach((element) => {
    const data = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const element = createProductItemElement(data);
    appendElementInSectionItems(element);
  });
}

window.onload = function onload() {
  const endepoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$QUERY';
  fetchContent(endepoint);
};

function appendElementInSectionItems(element) {
  const itemSection = document.querySelector('.items');
  itemSection.appendChild(element);
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

