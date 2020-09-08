const saveFunction = () => {
  const items = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', items);
};

function cartItemClickListener(event) {
  const carList = document.querySelector('.cart__items');
  carList.removeChild(event.target);
  removePrice(event);
  storageCart();
}

async function sumAll(li) {
  const total = document.querySelector('.total-price');
  const itemPrice = parseFloat(li.innerText.split('$')[1]);
  const totalPrice = parseFloat(total.innerHTML);
  const result = itemPrice + totalPrice;
  total.innerText = result;
  storageCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  saveFunction();
  sumAll(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getInTheCarList(event) {
  const idCardTarget = event.target.previousSibling.previousSibling.previousSibling.innerText;
  const url = `https://api.mercadolibre.com/items/${idCardTarget}`;
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      const addCpuCar = document.querySelector('.cart__items'); 
      addCpuCar.appendChild(createCartItemElement(data));
      storageCart();
    });
}

function createCustomElement(element, className, innerText) {
  const customE = document.createElement(element);
  customE.className = className;
  customE.innerText = innerText;
  return customE;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddCar = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCar.addEventListener('click', getInTheCarList);
  section.appendChild(btnAddCar);
  return section;
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

const clear = () => {
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    const total = document.querySelector('.total-price');
    total.innerText = 0;
    saveFunction();
  });
};

const storage = () => {
  if (localStorage.cartShop) document.querySelector('.cart__items').innerHTML = localStorage.cartShop;
};

function loadFile() {
  const idLoad = document.querySelector('#load');
  idLoad.className = 'loading';
  idLoad.innerText = 'loading...';
}

window.onload = function onload() {
  loadFile();
  urlInclude();
  storage();
  clear();
};
