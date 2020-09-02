  // Função nativa responsável por renderizar as imagens da API na tela
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
  // Função nativa responsável por renderizar os textos dos produtos captados da API na tela
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
  // Função nativa responsável por renderizar os números de ID retirados da API na tela
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
  // Requisito 3 - Função responsável por remover um item do
  // carrinho de compras ao clicarmos em cima dele.
function cartItemClickListener(event) {
  const total = document.querySelector('.total-price');
  const priceToRemove = parseFloat((event.target.innerText).split('$')[1]);
  const totalPrice = parseFloat(total.innerHTML);
  const sub = totalPrice - priceToRemove;
  total.innerText = sub;
  event.target.remove();
}
  // Requisito 5 - Função responsável por somar todos os
  // preços dos produtos adicionados no carrinho de compras.
async function sumItems(li) {
  const total = document.querySelector('.total-price');
  const itemPrice = parseFloat(li.innerText.split('$')[1]);
  const totalPrice = parseFloat(total.innerHTML);
  const sum = itemPrice + totalPrice;
  total.innerText = sum;
}
  // Função nativa responsável por criar as descrições dos
  // itens quando adicionados ao carrinho de compras.
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  sumItems(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}
  // Função nativa que cria os produtos com seus nomes, ids e imagens.
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
  // Capta o endereço da API com a query computador solicitada no requisito 1
const urlSearch = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  // Função responsável por fazer o fetch da API do MercadoLivre e resgatar os elementos
  // solicitados e enviá-los para a função createCartItemElement (que cria todos os produtos)
  // no carrinho de compras.
const fetchItem = (firstChild) => {
  const cartSection = document.querySelector('.cart');
  const spanLoading = document.createElement('span');
  spanLoading.className = 'loading';
  spanLoading.innerHTML = 'loading...';
  cartSection.appendChild(spanLoading);
  fetch(`https://api.mercadolibre.com/items/${firstChild}`)
    .then(response => response.json())
    .then((item) => {
      const sku = item.id;
      const name = item.title;
      const salePrice = item.price;
      const cart = document.querySelector('.cart__items');
      cart.appendChild(createCartItemElement({ sku, name, salePrice }));
      console.log(spanLoading);
      cartSection.removeChild(spanLoading);
    });
};
  // Requisito 2 - Função responsável por adicionar os produtos
  // ao carrinho de compras quando clicamos no botão 'adicionar ao carrinho'.
const getItem = () => {
  const target = event.target;
  const parentTarget = target.parentElement;
  const firstChild = parentTarget.firstChild.innerText;
  fetchItem(firstChild);
};
  // Requisito 1 e 7 - Função responsável por fazer o fetch
  // da API do MercadoLivre e resgatar os elementos
  // solicitados e enviá-los para a função createProductItemElement
  // (que cria todos os elementos). Além disso cria o elemento 'loading'
  // para simular carregamento enquanto a requisição fetch é feita!
const fetchUrl = () => {
  const cartSection = document.querySelector('.cart');
  const spanLoading = document.createElement('span');
  spanLoading.className = 'loading';
  spanLoading.innerHTML = 'loading...';
  cartSection.appendChild(spanLoading);
  fetch(urlSearch)
    .then(response => response.json())
    .then((object) => {
      const objectResult = object.results;
      objectResult.forEach((element) => {
        const sku = element.id;
        const name = element.title;
        const image = element.thumbnail;
        document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
        const items = document.querySelector('.items').lastChild;
        items.lastChild.addEventListener('click', getItem);
      });
      cartSection.removeChild(spanLoading);
    });
};
  // Requisito 6 - Botão que limpa todos os itens do carrinho de compras.
const emptyList = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const cart = document.querySelector('.cart__items');
    while (cart.firstChild) {
      cart.removeChild(cart.firstChild);
    }
    document.querySelector('.total-price').innerText = 0;
  });
};
window.onload = function onload() {
  fetchUrl();
  emptyList();
};
  // Requisito 4
  // FALTA EXECUTAR!
