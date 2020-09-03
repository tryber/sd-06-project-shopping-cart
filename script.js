const apiInfo = {
  api: 'https://api.mercadolibre.com/',
  endpoint: 'sites/MLB/',
};

url = `${apiInfo.api}${apiInfo.endpoint}`;

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

const subtrairItensCarrinho = (event) => {
  const preco = event.innerText.slice(-4)
  const totalprice = document.querySelector('.total-price');
  totalprice.innerText = Number(totalprice.innerText) - Number(preco)
}

async function cartItemClickListener(event) {
  const carrinho = document.querySelector('.cart__items');
  const remover = event.target;
  carrinho.removeChild(remover);
  subtrairItensCarrinho(event.target)
  if (carrinho.childNodes.length === 0) {
    localStorage.removeItem('Carrinho');
  }
}

async function somarItemsCarrinho(price) {
  const totalprice = document.querySelector('.total-price');
  totalprice.innerText = Math.round((Number(totalprice.innerText) + price) * 100) / 100;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const carrinho = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  carrinho.appendChild(li);
  localStorage.Carrinho = carrinho.innerHTML;
  return li;
}

async function itemClickListener(event) {
  const site = await `https://api.mercadolibre.com/items/${getSkuFromProductItem(event.target.parentNode)}`;
  fetch(site)
    .then(response => response.json())
    .then(({ id, title, price }) => {
      createCartItemElement({ id, title, price });
      somarItemsCarrinho(price);
    });
}

const removerItemsCarrinho = () => {
  const cartItems = document.querySelector('.cart__items');
  while (cartItems.firstChild) {
    cartItems.removeChild(cartItems.firstChild);
  }
  if (cartItems.childNodes.length === 0) {
    localStorage.removeItem('Carrinho');
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  button.addEventListener('click', itemClickListener);
  const botaoEsvaziar = document.querySelector('.empty-cart');
  botaoEsvaziar.addEventListener('click', removerItemsCarrinho);
  return section;
}

const carregarResultados = (resultado) => {
  resultado.forEach((element) => {
    const item = createProductItemElement(element);
    const container = document.querySelector('.items');
    container.appendChild(item);
  });
};

const carregarApi = (produto) => {
  const container = document.querySelector('.container');
  const site = `${url}search?q=$${produto}`;
  fetch(site)
    .then(resposta => resposta.json())
    .then((objeto) => {
      if (objeto.error) throw new Error(objeto.error);
      else carregarResultados(objeto.results);
    });
};

const carregarCarrinho = () => {
  const cartItems = document.querySelector('.cart__items');
  if (localStorage.Carrinho) {
    cartItems.innerHTML = localStorage.Carrinho;
    document.querySelectorAll('.cart__item').forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
};

window.onload = function onload() {
  carregarApi('computador');
  carregarCarrinho();
};
