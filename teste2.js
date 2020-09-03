function vowels (str) {
  const newStr = str.split('');
  const result = newStr.filter((curr) => curr === 'a' || curr === 'e' || curr === 'i' || curr === 'o ' || curr ==='u');
  return result.length
}

console.log(vowels('paulo'));
