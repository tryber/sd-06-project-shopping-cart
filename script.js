function createProductImageElement(imageSource) { // usei
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // usei
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) { // usei
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) { // usei
  return item.querySelector('span.item__sku').innerText;
}

async function sumValues(value) {
  const priceSpan = await document.getElementById('price');
  let price = await Number(priceSpan.innerText);
  price += value;
  priceSpan.innerText = (Math.round(price * 100) / 100);
}

let cart;

function cartItemClickListener(event) { // usei
  const minusPrice = Number(event.target.innerText.split('$')[1]) * -1;
  sumValues(minusPrice);
  this.remove();

  // tentando
  cart = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('cart', cart);
  console.log(cart);
}

function createCartItemElement({ sku, name, salePrice }) { // usei
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumValues(salePrice);
  return li;
}

function renderCartFromStorage() {
  console.log(localStorage.getItem('cart'));

  const cartItemsOl = document.querySelector('.cart__items');
  const storageCart = localStorage.getItem('cart');
  cartItemsOl.innerHTML = storageCart;

  let price = 0;
  for (let i = 0; i < cartItemsOl.children.length; i += 1) {
    num = cartItemsOl.children[i].innerText.split('$')[1];
    price += Number(num);
    console.log(price);
    sumValues(price);

    const li = cartItemsOl.children[i];
    li.addEventListener('click', cartItemClickListener);
  }
}

function fetchProduct(id) {
  const productId = id;

  fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then(response => response.json())
    .then((response) => {
      const product = {
        sku: response.id,
        name: response.title,
        salePrice: response.price,
      };

      productLi = createCartItemElement(product);
      productLi.addEventListener('click', cartItemClickListener);

      const cartItemsOl = document.querySelector('.cart__items');
      cartItemsOl.appendChild(productLi);

      // tentando
      cart = document.getElementsByClassName('cart__items')[0].innerHTML;
      // console.log(cart);
      localStorage.setItem('cart', cart);
      console.log(localStorage.getItem('cart'));
    });
}

function productItemListener(event) { // usei
  const productId = getSkuFromProductItem(event.target.parentElement);

  fetchProduct(productId);
}

function emptyButtonSetup() {
  const emptyButton = document.getElementsByClassName('empty-cart')[0];

  emptyButton.addEventListener('click', function () {
    const cartItemsOl = document.querySelector('.cart__items');
    cartItemsOl.innerHTML = '';
    const priceSpan = document.getElementById('price');
    priceSpan.innerHTML = '0';
    localStorage.clear();
  });
}

window.onload = function onload() { // usei
  const productContainer = document.querySelector('.items');

  const loadingSpan = document.createElement('span')
  loadingSpan.classList.add('loading');
  loadingSpan.innerText = 'loading...';
  productContainer.appendChild(loadingSpan);

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(response => response.results)
    .then((response) => {
      response.forEach((result) => {
        const product = {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        };

        loadingSpan.remove();

        const productSection = createProductItemElement(product);
        productContainer.appendChild(productSection);

        productSection.children[3].addEventListener('click', productItemListener);
      });
    });
  emptyButtonSetup();
  renderCartFromStorage();
};
