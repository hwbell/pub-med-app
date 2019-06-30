
// this function will slice a string at the specified character nearest to the index,
// occuring before the index
// ex - "this was cool, but ... " => "this was cool"

const sliceNearestChar = (str, char, index) => {

  if (str[index] === char) {
    return str.slice(0, index);
  }

  // chop the string at the index
  let tempStr = str.slice(0, index)

  for (let i = 0; i < tempStr.length; i++) {
    if (str[tempStr.length - i] === char) {
      return tempStr.slice(0, tempStr.length - i)
    }
  }
  return str;
}

const makeRandomString = (length) => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// console.log(makeRandomString(10))

// console.log(sliceNearestChar('Hey, man, I would, appreciate if, you get, off my back!', ',', 40))

module.exports = {
  sliceNearestChar,
  makeRandomString
}