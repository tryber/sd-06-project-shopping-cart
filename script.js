function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function updateData() {
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('carrinho', ol.innerHTML);
  const valorAtual = document.querySelector('.total-price');
  localStorage.setItem('valor', valorAtual.innerHTML);
}

async function sumPrices(price) {
  const preco = document.querySelector('.total-price');
  preco.innerHTML = ((Math.round(preco.innerHTML * 100) / 100) + price);
}

function cartItemClickListener(event) {
  const price = parseFloat(event.target.innerHTML.substr(event.target.innerHTML.indexOf('PRICE: $') + 8));
  const parent = event.target.parentNode;
  parent.removeChild(event.target);
  sumPrices(-price);
  updateData();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrices(+price);
  return li;
}


function createCustomElement(element, className, innerText, id) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    const ol = document.getElementsByClassName('cart__items')[0];
    e.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then(response => response.json())
      .then(dados => createCartItemElement(dados))
      .then(li => ol.appendChild(li))
      .then(() => {
        updateData();
      });
    });
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = localStorage.getItem('carrinho');
  document.querySelector('.total-price').innerHTML = localStorage.getItem('valor');
  if (ol.children.length > 0) {
    for (let i = 0; i < ol.children.length; i += 1) {
      ol.children[i].addEventListener('click', cartItemClickListener);
    }
  }
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    ol.innerHTML = '';
    localStorage.setItem('carrinho', ol.innerHTML);
    document.querySelector('.total-price').innerHTML = '0.00';
  },
  );
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(dados => dados.results.forEach(produto =>
    document.querySelector('.items').appendChild(createProductItemElement({ sku: produto.id, name: produto.title, image: produto.thumbnail }))))
    .then(() => {
      setTimeout(() => {
        document.getElementsByClassName('loading')[0].remove();
      }, 300);
    });
};
