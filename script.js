const apiInfo = {
  api: 'https://api.mercadolibre.com/',
  endpoint: 'sites/MLB/'
}
url = `${apiInfo.api}${apiInfo.endpoint}`

const carregarApi = (produto) => {
  const site = `${url}search?q=$${produto}`
  fetch(site)
    .then(resposta => resposta.json())
    .then(objeto => {
      console.log(objeto.results)
      if(objeto.error) throw new Error (objeto.error)
      else {
        carregarResultados(objeto.results)
      }
    })
}

const carregarResultados = (resultado) => {
  resultado.forEach(element => {
    const item = createProductItemElement(element)
    const container = document.querySelector('.items')
    container.appendChild(item)
  });
}

window.onload = function onload() { 
  carregarApi('computador')
};

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

function createProductItemElement({ id:sku, title:name, thumbnail:image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
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



