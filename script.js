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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const items = document.getElementsByClassName('items')[0];

  return items.appendChild(section);
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
      return printaNaTela;
    });
}

function criaItem() {
  const newElement = document.createElement('li');
  newElement.innerHTML = 'texto de teste';
  const lista = document.querySelector('ol.cart__items');
  lista.appendChild(newElement);
  return lista;
}

function chamaItem() {
  return document.getElementById('teste').addEventListener('click', criaItem);
}


function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const clicado = document.getElementsByClassName('cart__item')[0];
  const carrinho = document.querySelector('ol.cart__items');
  carrinho.appendChild(clicado);
  return carrinho;
  /* console.log(event.target);
  const url = `https://api.mercadolibre.com/items/$${event.target.value.sku}`
  fetch(url)
    .then(response => response.json())
    .then((newObject) => console.log(newObject)); */
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener(li));
  return li;
}

window.onload = function () {
  fetchApi();
  console.log('teste');
};
