window.onload = function onload() { };

// function cartLocalStorage() {
//   const cartLocalStorage = document.getElementsByClassName('cart__items')[0];
//   localStorage.setItem('Cart', cart.innerHTML);
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  document.querySelector('.cart__items').appendChild(li);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const renderCart = (itemId) => {
  const url = 'https://api.mercadolibre.com/items/';
  const id = itemId.sku;
  const endpoint = `${url}${id}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((response) => {
    const itemToAddOnCart = {
      sku: response.id,
      name: response.title,
      salePrice: response.price,
    };
    createCartItemElement(itemToAddOnCart);
    cartLocalStorage();
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', () => {
    renderCart({ sku });
  });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const apiSearch = () => {
  fetch('https:api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((response) => {
      const resultsOfResponse = response.results;
      resultsOfResponse.forEach((item) => {
        const arrayOfItems = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
        // console.log(arrayOfItems);
        document.querySelector('.items').appendChild(arrayOfItems);
      });
    });
};
// const btnEmpty = document.querySelector('.empty-cart');
// btnEmpty.addEventListener('click', () => {
//   document.querySelectorAll('.cart__items').innerHTML = '';
// });

// function showImage(e) {
//   const getFile = e.target.files[0];
//   memeImg.src = URL.createObjectURL(getFile);
// }
// output.addEventListener('change', showImage);

window.onload = () => {
  apiSearch();
  // renderCart('MLB1341706310');
};
