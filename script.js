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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

        productSection.children[3].addEventListener('click', function (event) {
          console.log(event.target.parentElement);
          console.log(getSkuFromProductItem(event.target.parentElement));
        });
      });
    })
    .then(() => {
      // console.log('vou usar depois');
    });
};
