
// criei uma URL com o endPoint do mercado livre
const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

// Criei a função que faz a requisição no site URL.
const fetchWindow = () => {
  // criei uma variavel e atribui a ela a url do endpoint do ML
  const endPoint = `${url}`;
  // criei um fatch na URL digitando aqui agora eu ate questiono se é necessario
  // os passos anteriores, talvez eu mexa no futuro.
  fetch(endPoint)
    // metodo then para receber a promisse binario e transformar em um obj
    .then(response => response.json())
    // metodo then que recebe o obj e transforma em um array ja no metodo
    // foreach que vai criar um obj pra cada outro obj recebido da response
    .then(object => object.results.forEach((item) => {
      const obj = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      // recolhi a section com a class 'items' para poder
      // adicionar filhos a ela
      const showcase = document.querySelector('.items');
      showcase.appendChild(createProductItemElement(obj));
    }));
};

// atribui ao meu script uma function que dispara
// functions assim que a pagina esta carregada
window.onload = function onload() {
  // disparei a function fetchWindow que na verdade é uma requisição
  // do API do mercado livre.
  fetchWindow();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
