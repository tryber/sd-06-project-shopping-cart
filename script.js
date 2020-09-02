window.onload = function onload() { };

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
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const renderCart = (itemId) => {
  const url = 'https://api.mercadolibre.com/items/';
  const id = itemId;
  const endpoint = `${url}${id}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((response) => {
    const itemToAddOnCart = {
      sku: response.id,
      name: response.title,
      salePrice: response.price,
    };
    document.querySelector('.cart__items').appendChild(createCartItemElement(itemToAddOnCart));
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', () => {
    renderCart('MLB1341706310');
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


// function showImage(e) {
//   const getFile = e.target.files[0];
//   memeImg.src = URL.createObjectURL(getFile);
// }
// output.addEventListener('change', showImage);

window.onload = () => {
  apiSearch();
  // renderCart('MLB1341706310');
};
