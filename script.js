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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// const idItem = event.target;
  // console.log(idItem.innerText);
  // while (idItem.className !== 'cart__item') { idItem = idItem.parentElement; }
  // console.log(idItem);
  // const oie = idItem.firstChild.firstChild.innerText;
function cartItemClickListener(event) {
  const containerElements = document.querySelector('.items');
  const idItem = event.target.innerText.split(' ')[1];
  for (let index = 0; index < containerElements.children.length; index += 1) {
    const element = containerElements.children[index];
    if (element.firstElementChild.innerText === idItem) {
      containerElements.removeChild(element);
    }
  }
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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  saveCart(sku);
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// console.log(localStorage.getItem('arrayDescription'));

function requisitionItem(idProduct) {
  fetch(`https://api.mercadolibre.com/items/${idProduct}`)
    .then(response => response.json())
    .then((object) => {
      const listPurchase = document.querySelector('.cart__items');
      listPurchase.appendChild(createCartItemElement(object));
    });
    // .catch(() => requisitionItem(idProduct));
}

function buttonSelectItemEvent() {
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
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${pesquisa}`)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((product) => {
        const containerElements = document.querySelector('.items');
        containerElements.appendChild(createProductItemElement(product));
      });
      buttonSelectItemEvent();
    });
    // .catch(() => requisitionMercadoLivreItem(pesquisa));
}

function renderShoppingCartSave() {
  if (localStorage.getItem('arrayIdShoppingCart') !== null) {
    console.log(JSON.parse(localStorage.getItem('arrayIdShoppingCart')))
    JSON.parse(localStorage.getItem('arrayIdShoppingCart'))
      .forEach((idCartItem) => requisitionItem(idCartItem));
  }
}

window.onload = function onload() {
  requisitionMercadoLivreItem('computador');
  renderShoppingCartSave();
};
