window.onload = function onload() {
  fetchApiProductList();
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
  const buttonAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  buttonAdd.addEventListener('click', cartItemAddClickListener);

  section.appendChild(buttonAdd);
  return section;
}

// Pega id do item
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Adiciona item no carrinho ao clicar no botão add
function cartItemAddClickListener(event) {
  fetchApiCartProductList(getSkuFromProductItem(event.target.parentNode));
}

// Ao clicar no produto do carrinho, remove-o
function cartItemClickListener(event) {
  event.target.remove();
}

// Pega os itens da api que serão adicionados no carrinho de compras
const fetchApiCartProductList = (sku) => {
  const url = `https://api.mercadolibre.com/items/${sku}`;

  fetch(url)
  .then(response => response.json())
  .then((response) => {
    const getCarItemsList = document.querySelector('.cart__items');
    getCarItemsList.appendChild(createCartItemElement(response.id, response.title, response.price));
  });
};

// Cria a lista de items dentro do carrinho
function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Pega os itens da api e cria a listagem de produtos
const fetchApiProductList = () => {
  // Query
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computadores';

  fetch(url)
  .then(response => response.json())
  .then((response) => {
    // Seleciona section items
    const getSectionItems = document.querySelector('.items');

    // Cria o produto e faz o append a section items
    response.results.forEach((product) => {
      const createProduct = createProductItemElement(product.id, product.title, product.thumbnail);
      getSectionItems.appendChild(createProduct);
    });
  });
};
