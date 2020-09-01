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

async function sumTotal(salePrice) {
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = Math.round((Number(totalPrice.innerText) + salePrice) * 100) / 100;
  localStorage.price = Number(totalPrice.innerText);
}

async function cartItemClickListener(event) {
  const price = Number(event.target.innerText.split('$')[1]);
  event.target.remove();
  await sumTotal(-price);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumTotal(salePrice);
  return li;
}

async function addToCart(event) {
  const monitorScreen = event.target;
  const sku = monitorScreen.parentNode.firstChild.innerHTML;
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const newItem = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const itemsList = document.querySelector('.cart__items');
      itemsList.appendChild(createCartItemElement(newItem));
      const salvedItens = document.getElementsByClassName('cart__items')[0];
      localStorage.setItem('salvedItens', salvedItens.innerHTML);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addToCart);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// requisito 6 Botão Limpar carrinho de compras
function clearAll() {
  console.log('Apagado!');
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.total-price').innerText = '0.00';
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
        });// usa o forEach para criar a lista conforme a função prédeterminada
        document.querySelector('.items').appendChild(products);
        document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('salvedItens');
      });
    })
    .then(document.getElementsByClassName('empty-cart')[0].addEventListener('click', clearAll));
};

window.onload = () => {
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 500);
  fetchProduct('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
};
