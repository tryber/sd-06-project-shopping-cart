let sum = 0;

const saveCart = () => {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('Cart', cartItems);
  localStorage.setItem('Price', sum);
};

const emptyCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const allCart = document.querySelectorAll('.cart__item');
    allCart.forEach(item => item.parentNode.removeChild(item));
    localStorage.clear();
    document.querySelector('.total-price').innerHTML = '';
    sum = 0;
  });
};

const loadCart = () => {
  const retrieveCart = localStorage.getItem('Cart');
  if (retrieveCart) {
    document.querySelector('.cart__items').innerHTML = retrieveCart;
    document.querySelector('.total-price').innerHTML = localStorage.Price;
  }
};

const loading = () => {
  if (!document.querySelector('.loading')) {
    const newLoad = document.createElement('div');
    newLoad.className = 'loading';
    newLoad.innerText = 'loading...';
    document.querySelector('.cart').appendChild(newLoad);
  } else {
    document.querySelector('.cart').removeChild(document.querySelector('.loading'));
  }
}

async function getPrice(item) {
  sum += item.price;
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = sum;
}

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

function cartItemClickListener(event) {
  this.parentNode.removeChild(this);
  saveCart();
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
      loading();
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(result => result.json())
        .then((itemObj) => {
          const objectSku = {
            sku: itemObj.id,
            name: itemObj.title,
            salePrice: itemObj.price,
          };
          getPrice(itemObj);
          const cartOL = document.querySelector('.cart__items');
          cartOL.appendChild(createCartItemElement(objectSku));
          saveCart();
        });
      loading();
    });
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchItems = () => {
  loading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(object => object.results)
    .then(list => list.forEach((item) => {
      const itemList = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      });
      const listItems = document.querySelector('.items');
      listItems.appendChild(itemList);
    }));
  loading();
};

window.onload = function onload() {
  fetchItems();
  emptyCart();
  loadCart();
};
