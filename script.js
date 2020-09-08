const urlEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
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

// Salvar Local
const functionSave = () => {
  const items = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', items);
};

// Remove item
function cartItemClickListener(event) {
  const li = event.target;
  event.target.remove();
  const total = document.querySelector('.total-price');
  const itemPrice = parseFloat(li.innerText.split('$')[1]);
  const totalPrice = parseFloat(total.innerHTML);
  const result = totalPrice - itemPrice;
  total.innerText = result;
  functionSave();
}

// Somatorio
async function sumPrice(li) {
  const total = document.querySelector('.total-price');
  const itemPrice = parseFloat(li.innerText.split('$')[1]);
  const totalPrice = parseFloat(total.innerHTML);
  const result = itemPrice + totalPrice;
  total.innerText = result;
  functionSave();
}

// Cria os itens selecionados do carrinho
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  functionSave();
  sumPrice(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Criacao dos itens retornados da API
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const sectionItems = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      const url = sku;
      fetch(`https://api.mercadolibre.com/items/${url}`)
        .then(response => response.json())
        .then((result) => {
          const createdItem = createCartItemElement(result);
          const ol = document.querySelector('.cart__items');
          ol.appendChild(createdItem);
          functionSave();
        });
    });
  sectionItems.appendChild(section);

  return section;
}


function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// dados da API
function fetchFunction() {
  setTimeout(() =>
  fetch(urlEndpoint)
    .then(response => response.json())
    .then(object => object.results)
    .then(result => result.forEach(resultElement => createProductItemElement(resultElement))),
    1000);
}

// Botão de limpar o carrinho
const clear = () => {
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    const total = document.querySelector('.total-price');
    total.innerText = 0;
    functionSave();
  });
};

// Salvar no local storage
const storage = () => {
  if (localStorage.cartShop) document.querySelector('.cart__items').innerHTML = localStorage.cartShop;
};

const LoadFile = () => {
  setTimeout(() => {
    const load = document.querySelector('.loading');
    load.remove();
  }, 1000);
};

window.onload = function onload() {
  fetchFunction();
  clear();
  storage();
  LoadFile();
};
