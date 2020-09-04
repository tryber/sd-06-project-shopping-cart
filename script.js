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
  return li;
}

const lendoLocal = () => {
  const lendo = localStorage.getItem('cartItems');
  const localDoCarrinho = document.querySelector('.cart__items');
  localDoCarrinho.innerHTML = lendo;
  const listaDeItens = document.querySelector('.cart__item');
  console.table(listaDeItens);
  listaDeItens.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  if (localStorage.totalPrice) {
    const loadPrice = localStorage.getItem('totalPrice');
    const localPrice = document.querySelector('.total-price');
    localPrice.innerText = loadPrice;
  }
};

const adicionaAoCarrinho = async (id) => {
  await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(resposta => resposta.json())
  .then((resposta) => {
    const { title, price } = resposta;
    const lista = createCartItemElement({ sku: id, name: title, salePrice: price });
    const listaCarrinho = document.querySelector('.cart__items');
    listaCarrinho.appendChild(lista);
    itensLocais(listaCarrinho.innerHTML);
  });
};

const lerProduto = async () => { // funcao que pega a lista de produtos da api e printa na página
  await fetch(url + produto) // pegando a url para a requisição
    // se teve uma resposta entre 200 e 299, atribui a um arquivo .json
    .then(resposta => resposta.json())
    /* se deu certo com o arquivo json, destrinchar o resultado para obter 
    os campos que preciso para o projeto */
    .then((resultado) => {
      resultado.results.forEach((produtos) => { // vamos percorrer todo o objeto
        console.table(produtos); // até aquí tudo bem !!!
        const { id, title, thumbnail } = produtos;  // separando o que eu quero do objeto
        // função que monta o item
        const item = createProductItemElement({ sku: id, name: title, image: thumbnail }); 
        item.addEventListener('click', (event) => { // oque fazer quando clicar
          const idDoProduto = getSkuFromProductItem(event.target.parentElement);
          adicionaAoCarrinho(idDoProduto);
        });
        const sessao = document.querySelector('.items'); // selecionando a tag html
        sessao.appendChild(item); // adicionando
      });
      document.querySelector('.container').removeChild(document.querySelector('.loading'))
    })
    .catch((error) => { // se der erro
      console.log(msnErroRequisicao); // mensagem malcriada
    })
}

window.onload = function onload() {
  lerProduto();  // montando a tela com os produtos
  lendoLocal();
  limparCarrinho();
};
