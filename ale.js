function vowels(str) {
  const newStr = str.split('');
  return newStr.reduce((acc, letter) => {
    if (letter === 'a' || letter === 'e' || letter === 'i' || letter === 'o' || letter === 'u') {
      return acc + 1
    }
    return acc
  }, 0)
}
console.log(vowels('Hi There'))
