// pegando a API
const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

// função para criar o localstorage
const localStorageShopCart = () => {
  const shopCart = document.querySelector('.cart__items').innerHTML;
  // console.log(shopCart);
  localStorage.shopCart = shopCart;

  const priceCart = document.querySelector('.total-price').innerHTML;
  // console.log(priceCart);
  localStorage.priceCart = priceCart
};

// função que apaga um item da lista do carrinho quando clicado
function cartItemClickListener(event) {
  event.target.remove();
  localStorageShopCart();
}

// função para criar a lista no carrinho de compras
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrices(salePrice);
  return li;
}

// é chamado pelo findId para retonar o innerText do id
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// é chamado pelo findId para fazer a parte do appendChild do cart
const handleCreatListCart = (objectForCart) => {
  const arrayProducts = document.querySelector('.cart__items');
  arrayProducts.appendChild(createCartItemElement(objectForCart));
};

// função para achar o id do botão clicado (usa em conjunto a getSkuFromProductItem)
function findId() {
  const click = event.target.parentElement;
  console.log(click);

  const idProduct = getSkuFromProductItem(click);
  console.log(idProduct);

  const endpoint = `https://api.mercadolibre.com/items/${idProduct}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      console.log(object);
      handleCreatListCart(object)
    })
    .then(() => localStorageShopCart())
}

// função correlacionada a função createProductItemElement (parte referente a imagem)
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função correlacionada a função createProductItemElement (parte referente aos textos)
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// é chamada pela função filterElementsObjectApi
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', findId);

  return section;
}

// função para olhar dentro do object.result e criar os subitens de .items
const filterElementsObjectApi = (elementsArray) => {
  elementsArray.forEach((element) => {
    const arrayProducts = document.querySelector('.items');
    arrayProducts.appendChild(createProductItemElement(element));
  });
};

// função para chamar a API
const handleAPI = () => {
  fetch(url)
  .then(response => response.json())
  .then((object) => {
    console.log(object);
    const objectNew = object.results;
    console.log(object.results);
    filterElementsObjectApi(objectNew);
  });
};

// função para recuperar o localstorage
const saveLocalStorage = () => {
  if (localStorage.shopCart && localStorage.priceCart) {
    document.querySelector('.cart__items').innerHTML = localStorage.shopCart;
    document.querySelector('.total-price').innerHTML = localStorage.shopCart;
  }
};

// função para remover (chamando cartItemClickListener ) algum elemento do retorno do localstorage
const removeCartItemClickListener = () => {
  document.querySelectorAll('.cart__item')
    .forEach(element => element.addEventListener('click', cartItemClickListener));
  localStorageShopCart();
};

// testando a soma (em construção!!!!!)
const sumPrices = (salePrice) => {
  sum += salePrice;
  document.querySelector('.total-price').innerText = `Total: R$ ${sum}`;
  console.log(sum);
}

// função que limpa a lista e chama para limpar o localstorage
const cleanItemsCart = () => {
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.total-price').innerHTML = `Total: R$ ${0}`;
  localStorageShopCart();
}

// função para click do botão limpar tudo
const clickButtonToCleanCart = () => {
  document.querySelector('.empty-cart')
    .addEventListener('click', cleanItemsCart);
}


window.onload = function onload() {
  handleAPI();
  saveLocalStorage();
  removeCartItemClickListener();
  clickButtonToCleanCart()
};

let sum = 0;