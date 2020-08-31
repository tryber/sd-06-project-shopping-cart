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

// requisito 6 Botão Limpar carrinho de compras
function clearAll() {
  console.log('Apagado!');
  document.getElementsByClassName('cart__items').innerHTML = '';
  localStorage.clear();
}

const fetchProduct = (url) => {
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((item) => {
        const products = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(products);
        document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('salvedItens');
      });
    })
    .then(document.getElementsByClassName('empty-cart')[0].addEventListener('click', clearAll));
};

window.onload = () => {
  fetchProduct('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
};
