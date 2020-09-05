

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
  const itemToRemove = event.target;
  itemToRemove.parentNode.removeChild(itemToRemove);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function setLoading(loading) {
  if (loading) {
    const whereTo = document.querySelector('.container');
    return whereTo.appendChild(createCustomElement('div', 'loading', 'loading...'));
  }
  const loadingText = document.querySelector('.loading');
  return loadingText.parentNode.removeChild(loadingText);
}

function removeAllCartItems() {
  const pressMeToCleanAll = document.querySelector('.empty-cart');
  const cartList = document.querySelector('.cart__items');
  pressMeToCleanAll.addEventListener('click', () => {
    while (cartList.firstChild) {
      cartList.removeChild(cartList.firstChild);
    }
  });
}

// requisito 2:
function fetchThisProduct(sku) {
  setLoading(true);
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then((product) => {
    const cartList = document.querySelector('.cart__items');
    const productList = {
      sku: product.id, name: product.title, salePrice: product.price,
    };
    cartList.appendChild(createCartItemElement(productList));
    setLoading(false);
  });
}
// cria o fetch - requisito1:
function fetchProduct(term) {
  setLoading(true);
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
  .then(response => response.json())
  .then((responseJson) => {
    const sectionItems = document.querySelector('.items');
    responseJson.results.forEach(
      product => sectionItems.appendChild(createProductItemElement({
        sku: product.id, name: product.title, image: product.thumbnail,
      })).querySelector('.item__add').addEventListener(
        'click', (buttonAddToCart) => {
          const thisProduct = buttonAddToCart.target.parentNode;
          fetchThisProduct(getSkuFromProductItem(thisProduct));
        },
      ));
    setLoading(false);
  });
}


window.onload = function onload() {
  fetchProduct('computador');
  removeAllCartItems();
};
