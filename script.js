// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Cria tag img com classe e src
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// salva no storage
function storageCar() {
  const olList = document.querySelector('.cart__items');
  window.localStorage.setItem('car_list', olList.innerHTML);
}

function cartItemClickListener(event) {
  const carList = document.querySelector('.cart__items');
  carList.removeChild(event.target);
  storageCar();
}

// recupera do storage
function storageSavedList() {
  const olList = document.querySelector('.cart__items');
  olList.innerHTML = window.localStorage.getItem('car_list');
  const liList = document.querySelectorAll('li'); // array c/ li da list
  liList.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}


// Retorna li com classe, txt(par), evento p/ sair de carrinho
// destructuring do data q vem cartItemClickListener
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // Depois customizar btn...
  // const btn = document.createElement('button');
  // li.appendChild(btn);
  li.addEventListener('click', cartItemClickListener);

  return li;
}

// Evento p/ btn do card, o coloca no carrinho
function getInTheCarList(event) {
  const idCardTarget = event.target.previousSibling.previousSibling.previousSibling.innerText;
  const url = `https://api.mercadolibre.com/items/${idCardTarget}`;
  fetch(url)
    .then(response => response.json())
    // .then(e => console.log(e));
    .then((data) => {
      const addCpuCar = document.querySelector('.cart__items');
      addCpuCar.appendChild(createCartItemElement(data));
      storageCar();
    });
}

// Cria tag com classe e txt
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// destructuring nos computadores q vem do fetchUrl, e cria section e coloca evento no btn
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  // customizando button
  const btnAddCar = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCar.addEventListener('click', getInTheCarList);// refazer p/ req 3...aff
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

const removeAlItems = () => {
  const listCar = document.querySelector('.cart__items');
  listCar.innerHTML = '';
  storageCar();
};

window.onload = function onload() {
  fetchUrl();
  storageSavedList();
  const btnRemoveAllItems = document.querySelector('.empty-cart');
  btnRemoveAllItems.addEventListener('click', removeAlItems);
};
