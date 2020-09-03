let fullPrice = 0;
let cart = [];

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
// ------------
function postElementinSection(object) {
  const mySection = document.getElementsByClassName('items')[0];
  mySection.appendChild(createProductItemElement(object));
}

function createMyObject(object) {
  object.results.forEach((result) => {
    myObject = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    postElementinSection(myObject);
  });
}
// ---------------

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  this.remove();
  const cartItemsOl = document.getElementsByTagName('ol')[0];
  localStorage.setItem(0, cartItemsOl.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCartFromStorage(item) {
  const cartItemsOl = document.getElementsByClassName('ol')[0];
  cartItemsOl.appendChild(createCartItemElement(item));
  // const items = document.getElementsByClassName('cart__item');
  console.log(cartItemsOl);

  // localStorage.clear();
  localStorage.setItem(1, 'hoy');
  localStorage.setItem(`item ${localStorage.length}`, item.sku);
}


function addButtonSetup() {
  const addButtonArray = document.getElementsByClassName('item__add');
  const itemsIDArray = document.getElementsByClassName('item__sku');

  for (let i = 0; i < addButtonArray.length; i += 1) {
    addButtonArray[i].addEventListener('click', function () {
      const url = `https://api.mercadolibre.com/items/${itemsIDArray[i].innerText}`;

      fetch(url)
        .then(response => response.json())
        .then((response) => {
          const myItemObject = {
            sku: itemsIDArray[i].innerText,
            name: response.title,
            salePrice: response.price,
          };

          console.log(cart);
          createCartFromStorage(myItemObject);
          // fullPrice = myItemObject.salePrice;
          // setTotal(fullPrice);
        })
    });
  }
}

function setLocalList() {
  const cartItemsOl = document.getElementsByTagName('ol')[0];
  cartItemsOl.innerHTML = localStorage.getItem(0);

  const currentItems = document.getElementsByClassName('cart__item');
  for (let i = 0; i < currentItems.length; i += 1) {
    currentItems[i].addEventListener('click', cartItemClickListener);
  }
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json())
    .then((response) => {
      createMyObject(response);
      setLocalList();
      addButtonSetup();
    })

};
