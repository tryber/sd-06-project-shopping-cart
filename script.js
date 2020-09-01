function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const cartItemClickList = document.querySelector('.cart__items');
  cartItemClickList.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// adicionado
function buttonAddCart(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(function (response) {
      if (!response.ok) throw new Error('Erro de requisição');
      return response.json();
    })
    .then((response) => {
      const carI = document.querySelector('.cart__items');
      const newI = createCartItemElement({
        sku: response.id,
        name: response.title,
        salePrice: response.price,
      });
      carI.appendChild(newI);
    })
    .catch(function (Error) {
      return Error;
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const buttonAddInCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(buttonAddInCart);
  buttonAddInCart.addEventListener('click', function () {
    buttonAddCart(sku);
  });
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// adicionado
const apiSite = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const apiFetch = async function () {
  return fetch(apiSite)
  .then(function (response) {
    if (!response.ok) throw new Error('Erro de requisição');
    return response.json();
  })
  .then(function ({ results }) {
    results.forEach(function (v) {
      // const prodIE = createProductItemElement({ sku: v.id, name: v.title, image: v.thumbnail });
      const itemInSe = document.querySelector('.items');
      itemInSe.appendChild(createProductItemElement({
        sku: v.id,
        name: v.title,
        image: v.thumbnail,
      }));
    });
  })
  .catch(function (Error) {
    return Error;
  });
};

window.onload = async () => {
  await apiFetch();
};
// IE = ItemElement
// I = Item
// i = item
// Se = Section
// REFERENCIAS
// fetch
