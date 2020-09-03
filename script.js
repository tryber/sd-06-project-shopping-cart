let myObj = {};
let cart = [];

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

function setupCartItems(item) {
  item.addEventListener('click', function () {

    // console.log(Object.values(localStorage).split(',')[0])

    // Object.values(localStorage).forEach(id => {
    //   const myId = id.split(',')[0];
    //   const myitemId = item.innerText.split(' ')[1];
    //   if (myId === myitemId) {
    //     // console.log(`${id.split(',')[0]} é igual a ${item.innerText.split(' ')[1]}`)
    //     localStorage.removeItem(id);
    //   }
  })
  for (let i = 0; i < localStorage.length; i += 1) {
    const item = 'item' + i;
    console.log(item)
    console.log(localStorage[item])
  }

  // console.log(item.innerText.split(' ')[1])
  item.remove();
}

function putIteminCart(item) {
  const allItems = document.getElementsByClassName('cart_item');
  console.log(allItems)

  const cartSection = document.getElementsByClassName('cart__items')[0]
  const cartItem = createCartItemElement(item);
  cartItem.classList.add('cart__item');
  cartSection.appendChild(cartItem);
  // console.log(cartItem.innerText)

  // localStorage.setItem(cartItem.innerText, localStorage.lenth)
  // console.log(localStorage)
  // setupCartItems(cartItem);
}

function setupButtons() {
  const allButtons = document.getElementsByClassName('item__add');
  Array.from(allButtons).forEach(button => {
    button.addEventListener('click', function () {
      const itemId = button.parentElement.children[0].innerText;
      // Descobri o .parentElement.children no stackOverflow
      const url = `https://api.mercadolibre.com/items/${itemId}`;

      fetch(url)
        .then(response => response.json())
        .then(response => {
          const myItem = {
            sku: response.id,
            name: response.title,
            salePrice: response.price,
          }
          putIteminCart(myItem)
        })
    });
  });
}

function renderProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(response => {
      response.results.forEach(result => {
        myObj = {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        }

        const itemsSection = document.querySelector('.items');
        const item = createProductItemElement(myObj);
        itemsSection.appendChild(item);
      })
    })
    .then(setupButtons);
}

window.onload = function onload() {
  renderProducts();

  const limpaEu = document.getElementById('test')
  limpaEu.addEventListener('click', function () {
    localStorage.clear();
  })
};


