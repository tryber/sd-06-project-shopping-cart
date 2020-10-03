function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function salvaItens() {
  const todosItens = document.querySelector('ol');
  localStorage.setItem('todos os itens', todosItens.innerHTML);
}

function cartItemClickListener(event) {
  const itemRemover = event.target;
  const carrinho = document.querySelector('ol.cart__items');
  carrinho.removeChild(itemRemover);
  salvaItens();
}

// cria o li no carrinho
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function recuperaItens() {
  const carrinho = document.getElementById('carrinho');
  carrinho.innerHTML = localStorage.getItem('todos os itens');
}

function apagaItensLista() {
  const carrinho = document.getElementById('carrinho');
  carrinho.innerHTML = '';
  salvaItens();
}

function limpaCarrinho() {
  const botaoLimpar = document.getElementsByClassName('empty-cart')[0];
  botaoLimpar.addEventListener('click', () => {
    apagaItensLista();
    localStorage.clear();
  });
}

function novaRequisicao(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then(response => response.json())
    .then((product) => {
      const dadosProduto = {
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      };
      const produtoClicado = createCartItemElement(dadosProduto);
      const carrinho = document.querySelector('ol.cart__items');
      carrinho.appendChild(produtoClicado);
      salvaItens();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', novaRequisicao);
  section.appendChild(botao);
  const items = document.getElementsByClassName('items')[0];
  return items.appendChild(section);
}

function apagaLoading() {
  const loadingText = document.querySelector('.loading');
  return loadingText.parentNode.removeChild(loadingText);
}

function fetchApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json())
    .then((obj) => {
      const arrayProdutos = obj.results;
      const arrayOficial = arrayProdutos.map(produto => ({
        sku: produto.id,
        name: produto.title,
        image: produto.thumbnail,
      }));
      const printaNaTela = arrayOficial.forEach((produto) => {
        createProductItemElement(produto);
      });
      apagaLoading();
      return printaNaTela;
    });
}


function loading() {
  const loadingText = document.createElement('span');
  loadingText.innerHTML = 'loading';
  loadingText.className = 'loading';
  const body = document.querySelector('body');
  return body.appendChild(loadingText);
}

function clickItemLocalStorage() {
  const carrinho = document.getElementById('carrinho');
  const itens = carrinho.children.length;
  for (let i = 0; i < itens; i += 1) {
    carrinho.children[i].addEventListener('click', cartItemClickListener);
  }
}

window.onload = function () {
  loading();
  fetchApi();
  recuperaItens();
  clickItemLocalStorage();
  limpaCarrinho();
};
