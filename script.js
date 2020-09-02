// Cria de forma assíncrona um texto 'loading' enquanto faz a requisição à API.
function showLoading() {
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'Loading...';
  const parent = document.querySelector('.items');
  parent.appendChild(loading);
}

// Remove o texto 'loading' quando retornar o resultado da API.
function hideLoading() {
  setTimeout(() => {
    const parent = document.querySelector('.items');
    parent.removeChild(parent.firstChild);
  }, 3000);
}

// Mostra o valor total dos produtos no carrinho de compras.
function showTotalPrice(sum) {
  const total = document.querySelector('.total-price');
  total.innerHTML = sum;
}

// Calcula de forma assíncrona o preço total dos produtos adicionados ao carrinho.
async function getTotalPrice() {
  let sum = 0;
  const getCartItems = await JSON.parse(localStorage.getItem('cartML'));
  if (getCartItems) {
    for (let index = 0; index < getCartItems.length; index += 1) {
      sum += getCartItems[index].price;
    }
  }
  showTotalPrice(sum);
}

// Salva os itens do carrinho no LocalStorage.
function saveToLocalStorage(id, title, price) {
  if (Storage) {
    const getCartItems = JSON.parse(localStorage.getItem('cartML'));
    const arrayOfItems = (getCartItems === null ? [] : getCartItems);
    arrayOfItems.push({ id, title, price });
    localStorage.setItem('cartML', JSON.stringify(arrayOfItems));
  }
  getTotalPrice();
}

// Remove um item específico do LocalStorage.
function removeItemFromLocalStorage(sku) {
  const arrayOfItems = JSON.parse(localStorage.getItem('cartML'));
  for (let index = 0; index < arrayOfItems.length; index += 1) {
    if (arrayOfItems[index].id === sku) {
      arrayOfItems.splice(index, 1);
      break;
    }
  }
  localStorage.setItem('cartML', JSON.stringify(arrayOfItems));
  getTotalPrice();
}

// Remove um item do carrinho de compras.
function cartItemClickListener(event) {
  const parentItems = document.querySelector('.cart__items');
  const item = event.target;
  removeItemFromLocalStorage(item.id);
  parentItems.removeChild(item);
}

// Cria um item para ser adicionado no carrinho de compras.
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

// Adiciona o item criado no carrinho de compras.
function addToCart(product) {
  const itemCart = document.querySelector('.cart__items');
  itemCart.addEventListener('click', cartItemClickListener);
  itemCart.appendChild(product);
}

// Limpa o carrinho de compras e o LocalStorage.
function clearCart() {
  const allItems = document.querySelector('.cart__items');
  allItems.innerHTML = '';
  localStorage.clear();
  getTotalPrice();
}

// Adiciona o evento de limpar o carrinho de compras.
function emptyCart() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', clearCart);
}

// Recupera os itens do carrinho do LocalStorage.
function getFromLocalStorage() {
  if (Storage) {
    const getProductCartItems = JSON.parse(localStorage.getItem('cartML'));
    arrayOfItems = (getProductCartItems === null ? [] : getProductCartItems);
    arrayOfItems.forEach((element) => {
      const itemProduct = createCartItemElement(element);
      addToCart(itemProduct);
    });
  }
  getTotalPrice();
}

// Busca por um produto específico na API e retorna os dados.
function fetchProductItem(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(resolve => resolve.json())
    .then((data) => {
      const itemProduct = createCartItemElement(data);
      addToCart(itemProduct);
      saveToLocalStorage(data.id, data.title, data.price);
    });
}

// Adiciona os produtos criados na tela.
function createItem(item) {
  const product = document.querySelector('.items');
  product.appendChild(item);
  item.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const sku = event.currentTarget.firstChild.innerText;
      fetchProductItem(sku);
    }
  });
}

// Cria o elemento imagem do produto.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Cria um elemento específico e retorna o mesmo.
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Cria o item produto.
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Busca na API todos os produtos com a palavra chave 'computador'.
function fetchProducts() {
  showLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resolve => resolve.json())
    .then(data => data.results.forEach((element) => {
      const createProduct = createProductItemElement(element);
      createItem(createProduct);
    }))
    .then(hideLoading());
}

// Chama as principais funções após a página ser carregada.
window.onload = function onload() {
  fetchProducts();
  getFromLocalStorage();
  getTotalPrice();
  emptyCart();
};
