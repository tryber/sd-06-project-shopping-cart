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

function parentCart(element) {
  const parentClass = document.querySelector('.cart__items');
  parentClass.appendChild(element);
}

function retrieveButtonData(button) {
  const itemsDetails = button.parentElement;
  const skuToFetch = itemsDetails.querySelector('.item__sku').innerText;
  return skuToFetch;
}

function createObjectToCart(data) {
  const response = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  return response;
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

async function buttonClick(event) {
  const clickedButton = event.target;
  const buttonSku = retrieveButtonData(clickedButton);
  const sendToCart = await fetch(`https://api.mercadolibre.com/items/${buttonSku}`);
  const jsonCart = await sendToCart.json();
  const dataToCart = await createObjectToCart(jsonCart);
  const cartFunc = await createCartItemElement(dataToCart);
  await console.log(jsonCart);
  await console.log(cartFunc);
  await parentCart(cartFunc);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', buttonClick);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function parentList(element) {
  const parentClass = document.querySelector('.items');
  parentClass.appendChild(element);
}

async function fetchProducts() {
  const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await result.json();
  const itemsArray = json.results;
  itemsArray.forEach((item) => {
    const data = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    const newItems = createProductItemElement(data);
    parentList(newItems);
  });
}

window.onload = function onload() {
  fetchProducts();
};
