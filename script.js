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

function cartItemClickListener(event) {
  // coloque seu código aqui
  const clickedItem = event.target;
  clickedItem.parentNode.removeChild(clickedItem);
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchSkuItem = (sku) => {
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const obj = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
    });
};

const fetchItens = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(list => list.results)
    .then((data) => {
      data.forEach((item) => {
        const obj = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        const section = createProductItemElement(obj);
        section.children[3].addEventListener('click', () => {
          fetchSkuItem(obj.sku);
        });
        document.querySelector('.items').appendChild(section);
      });
    });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const clearButton = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', function () { document.querySelector('.cart__items').innerHTML = ''; });
};
window.onload = function onload() {
  fetchItens();
  clearButton();
};

// const saveCart = document.getElementsByClassName('cart__items')[0];
// console.log(saveCart);
// // localStorage.setItem()
