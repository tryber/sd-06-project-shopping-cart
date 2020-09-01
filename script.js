const api = {
  adress: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  endpoint: 'computador',
};

const url = `${api.adress}${api.endpoint}`;

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
// event.target.remove();
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => {
    item.addEventListener('click', function () {
      item.remove();
    });
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const itemCart = () => {
// Capturando o evento, e logo após o proximo elemento html, com isso capturo o ID de cada item
  const target = event.target;
  const id = target.parentNode;
  const idCorreto = id.firstChild.innerText;
// Criando elemento de loading para informar enquanto a API busca as informações
  const loading = document.createElement('span');
  const cart = document.querySelector('.cart');
  cart.appendChild(loading);
  loading.className = 'loading';
  loading.innerHTML = 'loading...';

// Realizando a chama para a API, passando o id do item que foi clicado
  setTimeout(function () {
    fetch(`https://api.mercadolibre.com/items/${idCorreto}`)
    .then(response => response.json())
    .then((object) => {
// Criando o item a ser adicionado no carrinho, através da função CreateCartItemElement
      const items = createCartItemElement({
        sku: object.id,
        name: object.title,
        salePrice: object.price,
      });
// Renderizando em tela os items criados
      document.querySelector('.cart__items').appendChild(items);
// Selecionando o item do carrinho para depois remove-lo
      const cartItem = document.querySelector('.cart__item');
// Adicionando a função criada para remoção do item
      cartItem.addEventListener('click', cartItemClickListener);
      // Removendo o elemento de loading, assim que o item é carregado.
    });
    loading.remove();
  }, 2000);
};

// Criando a função que realiza o reset do carrinho
const clearCart = () => {
  const buttonClear = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');

// Adicionando evento ao click, enquanto houver elementos no cartItems, iremos remove-los
// Validando verificando se existe um primeiro filho

  buttonClear.addEventListener('click', function () {
    while (cartItems.firstChild) {
      cartItems.removeChild(cartItems.firstChild);
    }
  });
};

const connection = () => {
// Recebendo todos os itens da API, e renderizando em tela
  fetch(url)
  .then(response => response.json())
  .then((object) => {
    // Armazenando o resultado do fetch em uma constante
    const objectResult = object.results;
    objectResult.forEach((item) => {
      // Criando item por item, através do foreach e da funcão creacteProductItemElement
      const product = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      });
      // Renderizando em tela os itens criados e armazaendos na consta product
      document.querySelector('.items').appendChild(product);
      // Capturando o botão "Adicionar ao carrinho", para utilizar na funcão itemCart
      const button = document.querySelector('.items').lastChild;
      button.lastChild.addEventListener('click', itemCart);
    });
  })
    .then(clearCart);
};

window.onload = function onload() {
  connection();
  clearCart();
};
