function SaveCartOnLocalStorage() { // Salva o carrinho no storage
  const cartItemStorage = document.getElementsByClassName('cart__items')[0]; // Recebe uma lista com os items do cart
  localStorage.setItem('CartItems', cartItemStorage.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  SaveCartOnLocalStorage();
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  document.querySelector('.cart__items').appendChild(li);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchCartList = (item) => {
  const url = 'https://api.mercadolibre.com/items/';
  const endpoint = `${url}${item.sku}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((response) => {
    createCartItemElement({
      sku: response.id,
      name: response.title,
      salePrice: response.price,
    });
    SaveCartOnLocalStorage(); // e salva tudo no local storage
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      fetchCartList({ sku });
    });

  const cleanAllBtn = document.querySelector('.clean-cart-list');
  cleanAllBtn.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });

  SaveCartOnLocalStorage(); // salva as alterações no cart
  return section;
}

const fetchProductList = () => {
  fetch('https:api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((response) => {
      response.results.forEach((item) => {
        const arrayOfItems = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(arrayOfItems);
      });
    });
};

function LoadFromLocalStorage() {
  const cartItem = localStorage.getItem('CartItems');
  document.querySelector('.cart__items').innerHTML = cartItem;
}

window.onload = () => {
  fetchProductList();
  LoadFromLocalStorage();
};
