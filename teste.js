const asyncSum = (a,b) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(a + b), 2000)

  });
}

const printAsyncSum = async () => {
  console.log(await asyncSum(2,4))

}

printAsyncSum()


