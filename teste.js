const maior = (a, b) => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      if (a > b) {
        resolve(a);
      }
      reject('a < b');
    }, 2000);

  });
}

const verificaMaiorNumero = async (array, numero) => {
  return console.log(await maior(array, numero));
}

try {
  const promise =verificaMaiorNumero(10 , 20);
} catch (error) {
  console.log(error, 'a < b');
}











