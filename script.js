const myApi = 'https://api.mercadolibre.com';

// Cria um elemento do tipo impagem
const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

// Atualiza o Preço total do Carrinho
async function updateTotalPrice(myCart) {
  const cartItems = myCart.getElementsByTagName('li');
  let total = 0;
  for (let i = 0; i < cartItems.length; i += 1) {
    const itemPrice = cartItems[i].innerText;
    const price = parseFloat(itemPrice.split('$')[1]);
    total += price;
  }
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = total;
}

// Armazena no LocalStorage toda lista do carrinho
const updateLocalStorage = () => {
  const myCart = document.querySelector('.cart__items');
  localStorage.setItem('myList', myCart.innerHTML);
  updateTotalPrice(myCart);
};

// Remove um item da lista do carrinho ao ser clicado
const cartItemClickListener = (e) => {
  e.target.remove();
  updateLocalStorage();
};

// Cria a lista do Carrinho a partir do LocalStorage
const updateCartByLocalStorage = () => {
  const myCart = document.querySelector('.cart__items');
  myCart.innerHTML = localStorage.getItem('myList');
  // Cria os eventos click de cada item do carrinho
  const cartItems = myCart.getElementsByTagName('li');
  for (let i = 0; i < cartItems.length; i += 1) {
    cartItems[i].addEventListener('click', cartItemClickListener);
  }
  updateTotalPrice(myCart);
};

// Cria um elemento do tipo li para adicionar ao carrinho
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Chama requisição para buscar o produto para adicionar ao carrinho
const fetchProductById = (id) => {
  const endPoint = `${myApi}/items/${id}`;
  fetch(endPoint)
    .then(response => response.json())
    .then((object) => {
      const myProduct = { sku: object.id, name: object.title, salePrice: object.price };
      const cartItens = document.querySelector('.cart__items');
      cartItens.appendChild(createCartItemElement(myProduct));
      updateLocalStorage();
    });
};

// Recupera o ID do item
const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;

// Chama a requisição para depois incluir o produto no carrinho
const addCart = (e) => {
  const itemParent = (e.target).parentElement;
  const id = getSkuFromProductItem(itemParent);
  fetchProductById(id);
};

// Cria um elemento genérico
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addCart);
  }
  return e;
}

// Cria uma elemento SECTION com os dados do produto
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// Limpa a lista do carrinho de compras
const clearItems = () => {
  const myList = document.querySelector('.cart__items');
  myList.innerHTML = '';
  updateLocalStorage();
};

// Mostra todos os produtos retornados na requisição
const showProducts = (results) => {
  const itemProduct = document.querySelector('.items');
  results.forEach((result) => {
    const myObject = { sku: result.id, name: result.title, image: result.thumbnail };
    itemProduct.appendChild(createProductItemElement(myObject));
  });
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

// Faz a requisição para buscar todos os produtos pelo valor "computadores"
const fetchProducts = () => {
  const endPoint = `${myApi}/sites/MLB/search?q=$computadores`;
  fetch(endPoint)
    .then(response => response.json())
    .then((object) => {
      showProducts(object.results);
      removeLoading();
    });
};

// Onload da Página
window.onload = function onload() {
  fetchProducts();
  updateCartByLocalStorage();
  document.querySelector('.empty-cart').addEventListener('click', clearItems);
};
