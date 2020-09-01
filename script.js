
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
// a funcao saveCartLocally salva no localStorage os itens que
// estao inseridos no html do elemento de classe .cart__items
function saveCartLocally() {
  const storageItems = document.querySelector('.cart__items').innerHTML;
  localStorage.cartShop = storageItems;
}

// 04 Carregue o carrinho de compras através do
// LocalStorage ao iniciar a página
// a funcao loadStorage esta no window.onload e
// caso exista alguma informacao salva nele
// ele resgata essas infos e insere no HTML no elemento
// de classe .cart__items
function loadStorage() {
  if (localStorage.cartShop) {
    document.querySelector('.cart__items').innerHTML = localStorage.cartShop;
  }
}

// 03 Remova o item do carrinho de compras ao clicar nele
function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  const element = event.target;
  cartList.removeChild(element);
  saveCartLocally();
}

// async function sumCart() {
//   const currentCart = document.querySelector('.cart__items');
//   const cartProducts = currentCart.innerText;
//   cartProducts.toString;
//   const prices = cartProducts.split('$', cartProducts.length);
//   prices.splice(0, 1);
//   console.log(parseInt(prices));
// }

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
      sumCart();
    })
    .then(() => saveCartLocally());
  });
  return section;
}

function loading(load = true) {
  const container = document.querySelector('.items');
  container.innerHTML = '';

  if (load) {
    const loaderContainer = document.createElement('div');
    loaderContainer.style.display = 'flex';
    loaderContainer.style.alignItems = 'center';

    const loader = document.createElement('div');
    loader.className = 'loader';

    const loaderText = document.createElement('p');
    loaderText.appendChild(document.createTextNode('loading...'));
    loaderText.className = 'loading';

    loaderContainer.appendChild(loader);
    loaderContainer.appendChild(loaderText);

    container.appendChild(loaderContainer);
  }
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
  loading();
  loading(false);
}


// 06 Botão para limpar carrinho de compras
// nesta funcao clearCartButton primeiro limpamos o localStorage
// depois usamos o while para que ENQUANTO a lista
// de compras cartItems ainda possuir itens dentro dela
// a funcao ira remover a childNode
function clearCartButton(event) {
  localStorage.clear();
  const cartItems = document.querySelector('.cart__items');
  while (cartItems.childNodes.length > 0) {
    cartItems.removeChild(cartItems.childNodes[0]);
    saveCartLocally();
  }
}

window.onload = function onload() {
  fetchProducts();
  loadStorage();
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCartButton);
};
