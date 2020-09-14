

function fetchApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json())
    .then((obj) => {
      // SEPARO TUDO ISSO EM UMA NOVA FUNÇÃO? QUAL SERÁ O RETORNO
      // DE FETCH API?
      const arrayProdutos = obj.results;
      // trocar map por foreach, e para cada elem chamar a funcao de ciria o produto
      const objteste = arrayProdutos.map((produto) => ({
        sku: produto.id,
        name: produto.title,
        image: produto.thumbnail,
      }));
      console.log(objteste)
      return objteste;
  })
}

function criaObjetoNovo () {
  fetchApi();
  const newObject = {
    sku: obj.results.id,
    name: obj.results.title,
    image: obj.results.thumbnail,
  };
  console.log(newObject);
  return newObject
}



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
