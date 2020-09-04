/* vai comessar a bagaceira, vou comentar tudo pra ver o balaio de gato que tô fazendo*/
const produto = 'computador'; // vai que eu queira colocar uma opção de perquisa
const url = 'https://api.mercadolibre.com/sites/MLB/search?q='; // endereço a api
const msnErroRequisicao = 'Deu merda na requizição do produto'; // mensagem se a requisição de problema

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

// cria uma secao para cada elemento
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

const itensLocais = (item) => {
  localStorage.setItem('cartItems', item);
  const localPrice = document.querySelector('.total-price');
  localStorage.setItem('totalPrice', localPrice.innerText);
};

function somarValores(valor) {
  const localPrice = document.querySelector('.total-price');
  const priceNow = parseFloat(localPrice.innerText);
  const priceParam = parseFloat(valor);
  const summedPrice = Math.round(((priceNow + priceParam) * 100) / 100).toFixed(2);
  localPrice.innerText = summedPrice;
}

function subTotal(valor) {
  const precoTexto = document.querySelector('.total_price');
  const precoInteiro = parseFloat(precoTexto.innerText);
  const converterValor = valor.split('$');
  const preco = parseFloat(converterValor[1]);
  const total = Math.round(((precoInteiro - preco) * 100) / 100).toFixed(2);
  precoTexto.innerText = total;
}

function cartItemClickListener(event) {
  const valor = event.target.innerText;
  subTotal(valor);
  event.target.remove();
  const listaCart = document.querySelector('.cart__items');
  itensLocais(listaCart.innerHTML);
}

const limparCarrinho = () => {
  const btnLimpar = document.querySelector('.empty_cart');
  btnLimpar.addEventListener('click', () => {
    const lista = document.querySelector('.cart__items');
    lista.innerHTML = '';
    localStorage.clear();
    const precoTotal = document.querySelector('.total_price');
    precoTotal.innerText = '0.00';
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  somarValores(salePrice);
  return li;
}

/*
1. Listagem de produtos
Você deve criar uma listagem de produtos que devem ser consultados através da API do Mercado Livre.
Você deve utilizar o endpoint:
"https://api.mercadolibre.com/sites/MLB/search?q=$QUERY"
onde $QUERY deve ser o valor da sua busca. Para este trabalho, a busca deve ser o termo computador.
O retorno desse endpoint será algo no formato json. Por exemplo, se for pesquisado "computador":
A lista de produtos que devem ser exibidos é o array results no JSON acima.
Você deve utilizar a função createProductItemElement(product) para criar os componentes HTML referentes a um produto.
Adicione o elemento retornado da função createProductItemElement(product) como filho do elemento <section class="items">.
Obs: as variáveis sku, no código fornecido, se referem aos campos id retornados pela API.
*/

const listaDeProdutos = async () => { // funcao que pega a lista de produtos da api e printa na página
  await fetch(url + produto)
  .then(resposta => resposta.json())
  .then((resultado) => {
    resultado.results.forEach((produtos) => {
      console.table(produtos); // até aquí tudo bem !!!
      const { id, title, thumbnail } = produtos;  // separando o que eu quero do objeto
      const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
      const sessao = document.querySelector('.items'); // selecionando a tag html
      sessao.appendChild(item); // adicionando
    });
  })
  .catch((error) => { // se der erro
    console.log(msnErroRequisicao); // mensagem malcriada
  });
};


window.onload = function onload() {
  listaDeProdutos();  // montando a tela com os produtos
};
