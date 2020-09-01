
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

// 03 Remova o item do carrinho de compras ao clicar nele
function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
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
    .then(() => saveCart());
  });
  return section;
}
// 01 Listagem de produtos. criar uma listagem de produtos
// que devem ser consultados através da API do Mercado Livre
// funcao que faz essa requisicao da API e chama a funcao
// createProductItemElement para criar o item na tela
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
// nesta funcao pegamos a url da API e damos um fetch
// pegamos o objeto da resposta e o transformamos em algo legivel com o .json
// com o forEach, em cada elemento criamos um objeto novo
// com sua sku (id), name(title) e image(thumbnail)
// e depois fazemos um appendchild na secao 'items' do html
// a funcao que chamamos createProductItemElement ja cria
// a secao de cada item especifico com a classe 'item'

function clearCartButton(event) {
  localStorage.clear();
  while (document.querySelector('.cart__items').childNodes.length > 0) {
    document.querySelector('.cart__items')
    .removeChild(document.querySelector('.cart__items').childNodes[0]);
  }
}

window.onload = function onload() {
  fetchProducts();
  document.querySelector('.empty-cart').addEventListener('click', clearCartButton);
};
