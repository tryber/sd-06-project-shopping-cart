function getTotal() {
  const cartItems = document.querySelector('.cart__items');
  const totalContainer = document.querySelector('.total-price');
  const totalArray = [];
  [...cartItems.children].forEach((item) => {
    const a = item.innerHTML;
    const b = a.indexOf('$');
    const c = a.substring(b + 1, a.length);
    totalArray.push(parseFloat(c));
  });
  const reduced = totalArray.reduce((item1, item2) => item1 + item2, 0);
  // TypeError: reduce of empty array with no initial value
  totalContainer.innerHTML = `Total: ${reduced.toFixed(2)}`;
}

function emptyCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  localStorage.setItem('storageItems', '');
  getTotal();
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

function cartItemClickListener() {
  event.target.remove();
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('storageItems', cartItems.innerHTML);
  getTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', event => cartItemClickListener(event));
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

function addToCart(event) {
  const cartItems = document.querySelector('.cart__items');
  const parent = event.target.parentNode;
  const itemID = getSkuFromProductItem(parent);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(r => r.json())
    .then(product => createCartItemElement(product))
    .then(li => cartItems.appendChild(li))
    .then(() => {
      localStorage.setItem('storageItems', cartItems.innerHTML);
    })
    .then(getTotal);
}

function getItems() {
  const items = document.querySelector('.items');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
    .then(r => r.json())
    .then(r => r.results.map(item => createProductItemElement(item)))
    .then(itemList => itemList.forEach((item) => {
      items.appendChild(item);
    }))

    .then(() => {
      const itemAdd = document.querySelectorAll('.item__add');
      itemAdd.forEach((element) => {
        element.addEventListener('click', e => addToCart(e));
      });
    });
}

window.onload = function onload() {
  getItems();
  const cartItems = document.querySelector('.cart__items');
  const storageItems = localStorage.getItem('storageItems');
  cartItems.innerHTML = storageItems;
  [...cartItems.children].forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });

  getTotal();

  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', emptyCart);

  // const keys = Object.keys(localStorage);
  // const cartItems = document.querySelector('.cart__items');
  // for (let i = 0; i < keys.length; i += 1) {
  //   fetch(`https://api.mercadolibre.com/items/${keys[i]}`)
  //   .then(r => r.json())
  //   .then(product => createCartItemElement(product))
  //   .then(li => cartItems.appendChild(li))
  //   .then(() => localStorage.setItem(keys[i], keys[i]));
  // }
};

// preciso que os items que são adicionados pelo localstorage tenham id
// mas pra isso não posso dar stringify neles
// na real eu posso adicionar ao localstorage só o id como string.....
// e no load ele chama o fetch (o mesmo do addtocart, passando cada id naquele loop),
// pega o json, envia o resultado pra createcartitemelement
// e appendchild esse li ao cart_items

// será que eu consigo refatorar o addtocart pra usar no onload

// dando erro da forma acima, apesar de estar salvando os items no local storage
// não retorna exatamente o item que o teste quer
// acho que vou salvar em uma lista como era antes
