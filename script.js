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

// esqueceu dessa função usa ela depois
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const list = document.querySelector('.cart__items');
  const valor = event.target.innerHTML;
  const filterLocalStorage = JSON.parse(localStorage.getItem('arrayIdShoppingCart'))
  .filter(textCartItem => valor !== textCartItem);
  localStorage.setItem('arrayIdShoppingCart', JSON.stringify(filterLocalStorage));
  list.removeChild(event.target);
}

function saveCart(cartId) {
  const arrayId = [cartId];
  const arrayIdShoppingCart = JSON.parse(localStorage.getItem('arrayIdShoppingCart'));
  if (localStorage.getItem('arrayIdShoppingCart') === null) {
    localStorage.setItem('arrayIdShoppingCart', JSON.stringify(arrayId));
  } else if (!arrayIdShoppingCart.some(idLocal => idLocal === cartId)) {
    localStorage.setItem('arrayIdShoppingCart', JSON.stringify(arrayIdShoppingCart.concat(arrayId)));
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }, textSaveCart) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  if (textSaveCart) {
    li.innerHTML = textSaveCart;
  } else {
    li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  }
  saveCart(li.innerHTML);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createLoading() {
  const containerLoading = document.querySelector('.containerLoading');
  containerLoading.appendChild(createCustomElement('span', 'loading', 'loading...'));
}

function removeLoading() {
  const containerLoading = document.querySelector('.containerLoading');
  containerLoading.removeChild(containerLoading.firstElementChild);
}

function requisitionItem(idProduct) {
  createLoading();

  fetch(`https://api.mercadolibre.com/items/${idProduct}`)
    .then(response => response.json())
    .then((object) => {
      const listPurchase = document.querySelector('.cart__items');
      listPurchase.appendChild(createCartItemElement(object));
      removeLoading();
    });
    // .catch(() => requisitionItem(idProduct));
}

function eventClickButtonSelectItem() {
  const buttonSelectItem = document.querySelectorAll('.item__add');
  buttonSelectItem.forEach((buttonItem) => {
    buttonItem.addEventListener('click', () => {
      const idProduct = buttonItem.parentElement.firstElementChild.innerText;
      requisitionItem(idProduct);
      // cartItemClickListener(buttonItem.parentElement);
    });
  });
}

function requisitionMercadoLivreItem(pesquisa) {
  createLoading()

  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${pesquisa}`)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((product) => {
        const containerElements = document.querySelector('.items');
        containerElements.appendChild(createProductItemElement(product));
      });
      eventClickButtonSelectItem();
      removeLoading();
    });
    // .catch(() => requisitionMercadoLivreItem(pesquisa));
}

function renderShoppingCartSave() {
  if (localStorage.getItem('arrayIdShoppingCart') !== null) {
    const listPurchase = document.querySelector('.cart__items');
    JSON.parse(localStorage.getItem('arrayIdShoppingCart'))
      .forEach(idCartItem => listPurchase.appendChild(createCartItemElement({}, idCartItem)));
  }
}

function clearCart() {
  const buttonClearCart = document.querySelector('.empty-cart');
  const list = document.querySelector('.cart__items');
  buttonClearCart.addEventListener('click', () => {
    localStorage.clear();
    const arrayListLength = list.children.length;
    for (let index = 0; index < arrayListLength; index += 1) {
      const li = list.children[0];
      list.removeChild(li);
    }
  });
}

window.onload = function onload() {
  requisitionMercadoLivreItem('computador');
  renderShoppingCartSave();
  clearCart();
};
