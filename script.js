
function fetchApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json())
    .then((obj) => {
      const arrayProdutos = obj.results;
      // console.log(arrayProdutos);
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

fetchApi();

/* function criaObjetoNovo() {
  fetchApi();
  const newObject = {
    sku: obj.results.id,
    name: obj.results.title,
    image: obj.results.thumbnail,
  };
  console.log(newObject);
  return newObject;
} */

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
  const items = document.getElementsByClassName('items')[0];

  return items.appendChild(section);;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function () {
  fetchApi();
  console.log('teste');
};
