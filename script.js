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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // Não estava conseguindo colocar o eventListener do Button, porque quando tentava selecionar
  // os Btns ele ainda "nao tinha carregado",
  // vi que um colega tinha colocado o eventListener na criaçao do Btn e utilizei
  // a metodologia dele para que conseguisse o resultado desejado.
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(result => result.json())
        .then((object) => {
          const cartItem = createCartItemElement({
            sku: object.id,
            name: object.title,
            salePrice: object.price,
          });
          const cartOL = document.querySelector('.cart__items');
          cartOL.appendChild(cartItem);
        });
    });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(object => object.results)
    .then(list => list.forEach((item) => {
      const itemList = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail });
      const listItems = document.querySelector('.items');
      listItems.appendChild(itemList);
    }));
};
