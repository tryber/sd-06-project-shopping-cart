

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;

//   // const olCarrinho = document.querySelector('.cart_items');
//   // olCarrinho.appendChild(li);
//   return li;
// }

// function cartItemClickListener(event) {

//   const idCardTarget = event.target.previousSibling.previousSibling.previousSibling.innerText;
//   const url = `https://api.mercadolibre.com/items/${idCardTarget}`;
//   fetch(url)
//     .then(response => response.json())
//     .then(e => console.log(e));
//   .then(cpu => {
//     const finale = {
//       sku: cpu.id,
//       name: cpu.title,
//       salePrice: cpu.price,
//     };
//     console.log(finale);
//     createCartItemElement(finale);
//   });
// }

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  // e.addEventListener('click', cartItemClickListener);
  return e;
}
// destructuring nos computadores q vem do fetch
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const fetchUrl = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((cpu) => {
        // const finale = {      // obs: deu certo também!!
        //   sku: cpu.id,
        //   name: cpu.title,
        //   image: cpu.thumbnail,
        // };
        // createProductItemElement(finale);
        const productSection = document.querySelector('.items');
        const computadores = createProductItemElement(cpu);
        productSection.appendChild(computadores);
      });
    });
};

window.onload = function onload() {
  fetchUrl();
};
