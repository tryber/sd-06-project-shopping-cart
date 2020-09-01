function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// destructuring do data q vem cartItemClickListener
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;

  return li;
}

// function cartItemClickListener(event) {
//   // to be continue...
// }

function getOutOfTheCar(event){
  const idCardTarget = event.target.previousSibling.previousSibling.previousSibling.innerText;
  const url = `https://api.mercadolibre.com/items/${ idCardTarget }`;
  fetch(url)
    .then(response => response.json())
    // .then(e => console.log(e));
    .then((data) => {
      const addCpuCar = document.querySelector('.cart__items');
      addCpuCar.appendChild(createCartItemElement(data));
    });

}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// destructuring nos computadores q vem do fetchUrl
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  // customizando button
  const btnAddCar = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCar.addEventListener('click', getOutOfTheCar);// refazer p/ req 3...aff
  section.appendChild(btnAddCar);

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
        const computadores = createProductItemElement(cpu);// append c/ resultados
        productSection.appendChild(computadores);
      });
    });
};

window.onload = function onload() {
  fetchUrl();
};
