function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
let totalprice = 0;

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

const getPrice = text => Number(text.slice(text.indexOf('$') + 1));

const minusTotalPrice = (price) => {
  totalprice -= Math.round(price * 100) / 100;
  document.querySelector('.total-price').innerText = `${Math.round(totalprice * 100) / 100}`;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const clickedItem = event.target;
  // console.log(clickedItem.innerText);
  minusTotalPrice(getPrice(clickedItem.innerText));
  // const skuItem = getSkuFromProductItem(clickedItem);
  clickedItem.parentNode.removeChild(clickedItem);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const plusTotalPrice = (price) => {
  totalprice += price;
  const outputPrice = document.querySelector('.show-price');
  if (!document.querySelector('.total-price')) {
    const priceShow = document.createElement('span');
    priceShow.className = 'total-price';
    priceShow.innerText = `${totalprice}`;
    outputPrice.appendChild(priceShow);
  } else {
    document.querySelector('.total-price').innerText = `${totalprice}`;
  }
  // outputPrice.innerText = `Preço total: $${totalprice}`;
};

const loadingText = () => {
  const cart = document.querySelector('.cart');
  if (!document.querySelector('.loading')) {
    const loading = document.createElement('span');
    loading.className = 'loading';
    loading.innerText = 'loading...';
    cart.appendChild(loading);
  } else {
    cart.removeChild(document.querySelector('.loading'));
  }
};

const fetchSkuItem = async (sku) => {
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  loadingText();
  await fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const obj = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      loadingText();
      document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
      plusTotalPrice(obj.salePrice); // TESTE!
      // console.log(totalprice); // TESTE!!
      const saveCart = document.querySelector('.cart__items');
      localStorage.setItem('cartItemsSaved', saveCart.innerHTML);
    });
};

const fetchItens = async () => {
  loadingText();
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(list => list.results)
    .then((data) => {
      data.forEach((item) => {
        const obj = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        const section = createProductItemElement(obj);
        section.children[3].addEventListener('click', async () => {
          await fetchSkuItem(obj.sku);
        });
        document.querySelector('.items').appendChild(section);
      });
    });
  loadingText();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const clearButton = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', function () {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.setItem('cartItemsSaved', '');
    document.querySelector('.show-price').innerText = '';
    totalprice = 0;
  });
};

const saveStorage = () => {
  const saveCart = document.querySelector('.cart__items');
  // console.log(saveCart.innerHTML); // TESTE
  localStorage.setItem('cartItemsSaved', saveCart.innerHTML);
};

const loadStorage = () => {
  const saveCart = document.querySelector('.cart__items');
  if (localStorage) {
    saveCart.innerHTML = localStorage.getItem('cartItemsSaved');
  }
};

window.onload = async function onload() {
  loadStorage();
  await fetchItens();
  clearButton();
  saveStorage();
};
