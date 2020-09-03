window.onload = function onload() { };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function saveToStorageCar() {
  const list = document.querySelector('.cart__items');
  window.localStorage.setItem('car_list', olList.innerHTML);
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
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  saveToStorageCar();}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.price = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
  
  async function addProductToCart(id) {
    const endpoint = `https://api.mercadolibre.com/items/${id}`;
}

const urlInclude = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((cpu) => {
      const myItems = document.querySelector('.items');
      const pcs = createProductItemElement(cpu);
      myItems.appendChild(pcs);
    });
  });
};

window.onload = function onload() {
  urlInclude();
};
