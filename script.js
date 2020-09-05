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

function saveItems() {
  const items = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', items);
  const prices = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('price', prices);
  // comando pronto para escolher o que salvar
  // setItem serve para salvar e passamos nome e o valor (cart e items);
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  const item = event.target;
  ol.removeChild(item);
  const priceItem = (event.target.innerHTML).split('$')[1] * -1;
  sumPrices(priceItem)
  saveItems();
}

const sumPrices = async (price) => {
  if (!localStorage.price) {
    localStorage.price = price;
  } else {
    localStorage.price = parseFloat(localStorage.price) + price;
  }
  const divPrice = document.querySelector('.total-price');
  divPrice.innerHTML = localStorage.price;
  saveItems();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saveItems();
  sumPrices(salePrice);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    const getId = sku;
    fetch(`https://api.mercadolibre.com/items/${getId}`)
    .then(response => response.json())
    .then((result) => {
      const createItem = createCartItemElement(result);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(createItem);
      saveItems();
    });
  });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchFunction = () => {
  const functionHTML = document.querySelector('.items');
  setTimeout(() => {
    fetch(url)
    .then(response => response.json())
    .then(object => object.results)
    .then((result) => {
      result.forEach((item) => {
        const section = createProductItemElement(item);
        functionHTML.appendChild(section);
      });
    });
  }, 500);
};

const clearButton = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    const totalPrice = document.querySelector('.total-price');
    totalPrice.innerHTML = 0;
    localStorage.clear();
  });
};

const storage = () => {
  if (localStorage.cart) {
    document.querySelector('.cart__items').innerHTML = localStorage.cart;
    document.querySelectorAll('.cart__item').forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
  if (localStorage.price) {
    document.querySelector('.total-price').innerHTML = localStorage.price;
  }
};

const loadDiv = () => {
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 500);
};

window.onload = function onload() {
  fetchFunction();
  clearButton();
  storage();
  loadDiv();
};
