window.onload = function onload() {
    fetchApi();
 };

function createProductImageElement(imageSource) { // Cria a imagem do produto
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Cria um 'custom html a partir de um element com a class 'className' e conteudo 'innerText'
function createCustomElement(element, className, innerText) { 
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Cria o produto 
function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Pega sku
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

// Query 
const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computadores';

// Pega os itens da api
const fetchApi = () => {
  fetch(url)
  .then(response => response.json())
  .then((response) => {

    const getSectionItems = document.querySelector('.items');

    response.results.forEach(product => {

      const createProduct = createProductItemElement(product.id, product.title, product.thumbnail);
      getSectionItems.appendChild(createProduct);
    });

  });
}