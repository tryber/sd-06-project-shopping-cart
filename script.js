const apiURL = {
  url: 'https://api.mercadolibre.com/',
  endPointProduct: 'sites/MLB/search?q=',
  search: 'computador',
  endPointItem: 'items/',
};
// Mostra o valor total dos produtos no carrinho de compras.
function showTotalPrice(sum) {
  const total = document.querySelector('.total-price');
  total.innerHTML = sum;
}
// Calcula de forma assíncrona o preço total dos produtos adicionados ao carrinho.
async function getTotalPrice() {
  let sum = 0;
  const getCartItems = await JSON.parse(localStorage.getItem('cartML'));
  if (getCartItems) {
    for (let index = 0; index < getCartItems.length; index += 1) {
      sum += getCartItems[index].price;
    }
  }
  showTotalPrice(sum);
}
// Salva os itens do carrinho no LocalStorage.
function saveToLocalStorage(id, title, price) {
  if (typeof Storage !== 'undefined') {
    let arrayOfItems = [];
    const getCartItems = JSON.parse(localStorage.getItem('cartML'));
    arrayOfItems = (getCartItems === null ? [] : getCartItems);
    arrayOfItems.push({ id, title, price });
    localStorage.setItem('cartML', JSON.stringify(arrayOfItems));
    getTotalPrice();
  }
}
// Remove um item específico do LocalStorage.
function removeItemFromLocalStorage(sku) {
  const arrayOfItems = JSON.parse(localStorage.getItem('cartML'));
  for (let index = 0; index < arrayOfItems.length; index += 1) {
    if (arrayOfItems[index].id === sku) {
      arrayOfItems.splice(index, 1);
      break;
    }
  }
  localStorage.setItem('cartML', JSON.stringify(arrayOfItems));
  getTotalPrice();
}
// Remove um item do carrinho de compras.
function cartItemClickListener(event) {
  const item = event.target;
  item.remove();
  // console.log('target:' + event.target.innerHTML.slice(5, 17));
  removeItemFromLocalStorage(event.target.innerHTML.slice(5, 17));
  removeItemFromLocalStorage(event.target.innerHTML.slice(5, 18));
}
// Pega informação do LocalStorage.
function getFromLocalStorage() {
  if (Storage) {
    const getProductCartItems = JSON.parse(localStorage.getItem('cartML'));
    arrayOfItems = (getProductCartItems === null ? [] : getProductCartItems);
    arrayOfItems.forEach((element) => {
      createCartItemElement(element.id, element.title, element.price);
      createProductItemElement(element.id, element.title, element.price);
    });
  }
  getTotalPrice();
}
// Cria os elementos no HTML para a sessão principal onde se mostra os Items.
function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', renderCartItem);
  section.appendChild(button);
  return section;
}
// Cria um elemento do carrinho de compras.
function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cartOl = document.querySelector('.cart__items');
  cartOl.appendChild(li);
  console.log(cartOl.appendChild(li));
  return li;
}
// Da um fetch no item pelo ID e chama as funções: createCartItemElement e saveToLocalStorage.
async function fetchItemsID(itemID) {
  const itemURL = `${apiURL.url}${apiURL.endPointItem}${itemID}`;
  await fetch(itemURL)
    .then(response => response.json())
    .then((resultJSON) => {
      createCartItemElement(resultJSON.id, resultJSON.title, resultJSON.price);
      saveToLocalStorage(resultJSON.id, resultJSON.title, resultJSON.price);
    })
    .catch(error => window.alert(error));
}
// Cria um elemento customizado no HTML.
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// Cria o elemento imagem no HTML.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// Cria o elemento HTML no carrinho.
function renderCartItem(event) {
  const itemID = event.target.parentNode.children[0].innerText;
  fetchItemsID(itemID);
}
// Pega o array de produtos vinda de fetchItems() e desenha com createProductItemElement(). 
function listReturned(arrOfProducts) {
  arrOfProducts.forEach((element) => {
    const secItems = document.querySelector('.items');
    return secItems
      .appendChild(createProductItemElement(element.id, element.title, element.thumbnail));
  });
}
// Faz o fetch na API do ML e usa a função listReturned() para transformar o array.
function fetchItems() {
  const productURL = `${apiURL.url}${apiURL.endPointProduct}${apiURL.search}`;
  fetch(productURL)
    .then(response => response.json())
    .then((resultJSON) => {
      const result = resultJSON.results;
      listReturned(result);
    })
    .catch(error => window.alert(error));
}
// Pega o SKU(ou ID) no HTML do item e o retorna.
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  const loading = document.querySelector('.loading');
  fetchItems();
  getFromLocalStorage();
  setTimeout(() => {
    loading.remove();
  }, 500);
};
