function createProductImageElement(imageSource) { // usei
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // usei
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) { // usei
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) { // usei
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) { // usei
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function productItemListener(event) { // usei
  const productId = getSkuFromProductItem(event.target.parentElement);

  fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then(response => response.json())
    .then((response) => {
      const product = {
        sku: response.id,
        name: response.title,
        salePrice: response.price,
      };

      productLi = createCartItemElement(product);
      const cartItemsOl = document.querySelector('.cart__items');
      cartItemsOl.appendChild(productLi);
    });
}

window.onload = function onload() { // usei
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(response => response.results)
    .then((response) => {
      response.forEach((result) => {
        const product = {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        };

        const productContainer = document.querySelector('.items');
        const productSection = createProductItemElement(product);
        productContainer.appendChild(productSection);

        productSection.children[3].addEventListener('click', productItemListener);
      });
    })
    .then(() => {
      // console.log('vou usar depois');
    });
};
