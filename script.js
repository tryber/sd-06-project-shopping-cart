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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// adicionando produtos no localStorage
const adicionaLocalStorage = (item) => {
  localStorage.setItem('carrinhoDeCompras', item);
}

// removendo produtos do localStorage
const removeLocalSrtorage = (item) => {
}

// lendo produtos no localStorage
const lendoLocalStorage = () => {
  const listaLocalStorage = localStorage.getItem('carrinhoDeCompras');
  const localDoCarrinho = document.querySelector('.cart__items');
  localDoCarrinho.innerHTML = listaLocalStorage;
  const listarNoHtml = document.querySelector('.cart__item');
  listarNoHtml.forEach((itens) => {

  });
}

// função que adiciona o produto no carrinho
const adicionaAoCarrinho = async (id) => {
  await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(resposta => resposta.json())
  .then((resposta) => {
    const { title, price } = resposta;
    const lista = createCartItemElement({ sku: id, name: title, salePrice: price });
    const listaCarrinho = document.querySelector('.cart__items');
    listaCarrinho.appendChild(lista);
    adicionaLocalStorage(lista.innerText);
  });
};

// funcao que limpa o carrinho de compras
const limparCarrinho = () => {
  const btnLimpar = document.querySelector('.empty-cart');
  btnLimpar.addEventListener('click', () => {
    const areaParaLimpar = document.querySelector('.cart__items');
    areaParaLimpar.innerHTML = '';
    localStorage.clear();
  });
}

// funcao que pega a lista de produtos da api e printa na página
const listaDeProdutos = async () => {
  await fetch(url + produto)
  .then(resposta => resposta.json())
  .then((resultado) => {
    resultado.results.forEach((produtos) => {
      const { id, title, thumbnail } = produtos;  // separando o que eu quero do objeto
      const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
      item.addEventListener('click', (event) => {
        const idDoProduto = getSkuFromProductItem(event.target.parentElement);
        adicionaAoCarrinho(idDoProduto);
      });
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
