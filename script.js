
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// 04 Carregue o carrinho de compras através do
// LocalStorage ao iniciar a página
// removeFromStorage remove o elemento recebido
// e se o item no array no localStorage for ===
// ao id do elemento target do evento, ele
function removeFromStorage(element) {
  const textElement = element.innerText.split('|');
  const itemId = textElement[0].split(':')[1];
  const itemsProd = localStorage.getItem('cart').split(',');
  for (let i = 0; i < itemsProd.length; i += 3) {
    if (itemsProd[i].trim() === itemId.trim()) {
      itemsProd.splice(itemsProd.indexOf(itemsProd[i]), 3);
      localStorage.setItem('cart', itemsProd);
    }
  }
}

// 04 Carregue o carrinho de compras através do
// LocalStorage ao iniciar a página
// nessa funcao, caso o item seja removido do carrinho
// de compras ele tb  sera removido do localStorage
function checkStorage(element) {
  if (localStorage.cart.split(',').length === 3) {
    localStorage.clear();
  } else {
    removeFromStorage(element);
  }
}

// 03 Remova o item do carrinho de compras ao clicar nele
function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  const element = event.target;
  checkStorage(element);
  cartList.removeChild(element);
}

// 04 Carregue o carrinho de compras através do
// LocalStorage ao iniciar a página
// nessa funcao pegamos o que ja existe no localStorage
// para ser renderizado na tela quando acontecer o window.onload
// primeiro passamos por um if, para ver se existe
// alguma informacao salva no localStorage
// se existir, dividimos esse arr nas ','
// e fazemos um for para que possamos ler cada
// parte do arr dentro das variaveis na string
// adicionando esses itens no innertext do li
// criado na funcao dentro da lista do carrinho de compras
// e dando um appendChild para inseri-los na lista
function renderLocallySavedCart() {
  if (localStorage.cart !== '' && localStorage.length !== 0) {
    const items = localStorage.getItem('cart').split(',');
    for (let i = 0; i < items.length; i += 3) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = `SKU: ${items[i].trim()} | NAME: ${items[i + 1].trim()} | PRICE: $${items[i + 2]}`;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('.cart__items').appendChild(li);
    }
  }
}

// 02 Adicionando o produto ao carrinho de compras
// com essa funcao ao clicar no item eh criado uma
// li com as infos, que voltam para a funcao
// createProductItemElement para o elemento ser criado
// na tela
// 03 essa funcao cria o eventlisteneer para remover o
// item do carrinho ao ser clicado
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 04 Carregue o carrinho de compras através do
// LocalStorage ao iniciar a página
// a funcao saveCartLocally recebe como parametros o
// id, nome e preco do produto e caso o localStorage
// esteja vazio, ele salva os itens atuais do carrinho de compras atual
function saveCartLocally({ id, price, title }) {
  if (localStorage.length === 0 || localStorage.cart === '') {
    localStorage.setItem('cart', `${id}, ${title}, ${price}`);
  }
}

// 01 Listagem de produtos. criar uma listagem de produtos
// que devem ser consultados através da API do Mercado Livre
// 02 Adicionando o produto ao carrinho de compras
// createProductItemElement funcao que cria o item do produto
// na tela principal, com o eventListener para fazer
// requisicao pelo preco do produto para ir para o carrinho de compras
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const itemsSection = document.querySelector('.items');
  itemsSection.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(object => object.json())
    .then((object) => {
      const item = createCartItemElement({
        sku: object.id,
        name: object.title,
        salePrice: object.price,
      });
      const cart = document.querySelector('.cart__items');
      cart.appendChild(item);
    })
    .then(() => saveCartLocally());
  });
  return section;
}
// 01 Listagem de produtos. criar uma listagem de produtos
// que devem ser consultados através da API do Mercado Livre
// funcao que faz essa requisicao da API e chama a funcao
// createProductItemElement para criar o item na tela
// pegamos a url da API e damos um fetch e pegamos o objeto
// da resposta e o transformamos em algo legivel com o .json
// com o forEach, em cada elemento criamos um objeto novo
// com sua sku (id), name(title) e image(thumbnail)
// e depois fazemos um appendchild na secao 'items' do html
// a funcao que chamamos createProductItemElement ja cria
// a secao de cada item especifico com a classe 'item'
function fetchProducts() {
  const searchValue = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=$${searchValue}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const products = object.results;
      products.forEach((element) => {
        const product = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        document.querySelector('.items').appendChild(product);
      });
    });
}

// 06 Botão para limpar carrinho de compras
// nesta funcao clearCartButton primeiro limpamos o localStorage
// depois usamos o while para que ENQUANTO a lista
// de compras cartItems ainda possuir itens dentro dela
// a funcao ira remover a childNode
function clearCartButton(event) {
  localStorage.clear();
  const cartItems = document.querySelector('.cart__items');
  localStorage.clear();
  while (cartItems.childNodes.length > 0) {
    cartItems.removeChild(cartItems.childNodes[0]);
  }
}

window.onload = function onload() {
  fetchProducts();
  renderLocallySavedCart();
  document.querySelector('.empty-cart').addEventListener('click', clearCartButton);
};
