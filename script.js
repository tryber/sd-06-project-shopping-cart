async function preco(price) {
  const TOTALPRICE = document.getElementsByClassName('total-price')[0];
  TOTALPRICE.innerHTML = (parseFloat(TOTALPRICE.innerHTML) + price);
}

function loading() {
  if (document.getElementsByClassName('loading').length === 0) {
    const SPAN = document.createElement('span');
    SPAN.innerHTML = 'loading...';
    SPAN.className = 'loading';
    document.getElementsByClassName('cart')[0].appendChild(SPAN);
  } else {
    const SPAN = document.getElementsByClassName('loading')[0];
    SPAN.parentElement.removeChild(SPAN);
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, id) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (id !== undefined) {
    e.id = id;
  }
  return e;
}

function getSkuFromProductItem(item) {
  const id = item.querySelector('span.item__sku').innerText;
  item.classList.toggle('selected');
  return id;
}

function updateCartItem() {
  const CARTITEMS = document.getElementsByClassName('cart__items')[0];
  const TOTALPRICE = document.getElementsByClassName('total-price')[0];
  localStorage.setItem('cartNow', CARTITEMS.innerHTML);
  localStorage.setItem('value', TOTALPRICE.innerHTML);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const PARENT = event.target.parentNode;
  const PRICE = parseFloat(event.target.innerHTML.substr(event.target.innerHTML.indexOf('PRICE: $') + 8));
  preco(-PRICE);
  PARENT.removeChild(event.target);
  updateCartItem();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  preco(price);
  return li;
}

function getClickList(event) {
  if (event.target.className === 'item__add') {
    const ID = getSkuFromProductItem(event.target.parentNode);
    loading();
    fetch(`https://api.mercadolibre.com/items/${ID}`)
    .then(response => response.json()).then((data) => {
      const CARTITEMS = document.getElementsByClassName('cart__items')[0];
      CARTITEMS.appendChild(createCartItemElement(data));
    }).then(() => updateCartItem());
    setTimeout(() => {
      loading();
    }, 3000);
  }
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', getClickList);
  return section;
}

function INITIAL() {
  const CARTITEMS = document.getElementsByClassName('cart__items')[0];
  const TOTALPRICE = document.getElementsByClassName('total-price')[0];
  CARTITEMS.innerHTML = localStorage.getItem('cartNow');
  if (localStorage.getItem('value') === null) {
    TOTALPRICE.innerHTML = '0.00';
  } else {
    TOTALPRICE.innerHTML = localStorage.getItem('value');
  }
  if (CARTITEMS.children.length > 0) {
    for (let i = 0; i < CARTITEMS.children.length; i += 1) {
      CARTITEMS.children[i].addEventListener('click', cartItemClickListener);
    }
  }
  loading();
}

window.onload = function onload() {
  const CARTITEMS = document.getElementsByClassName('cart__items')[0];
  INITIAL();
  const EMPTYCART = document.getElementsByClassName('empty-cart')[0];
  EMPTYCART.addEventListener('click', () => {
    CARTITEMS.innerHTML = '';
    document.getElementsByClassName('total-price')[0].innerHTML = '0';
    updateCartItem();
  });
  const COMPUTADOR = 'computador';
  const API = `https://api.mercadolibre.com/sites/MLB/search?q=${COMPUTADOR}`;
  const PRODUTOS = document.getElementsByClassName('items')[0];
  const RESULTADO = [];
  fetch(API).then(data => data.json()).then(data => data.results.forEach((result) => {
    PRODUTOS.appendChild(createProductItemElement(result));
    RESULTADO.push(result);
  }))
  .then(data => data);
  setTimeout(() => {
    loading();
  }, 3000);
};
