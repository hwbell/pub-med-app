
// this comibines two objects for the keys specified, giving priority to obj1
const combineObjects = (obj1, obj2, keys) => {

  if(!obj1 || !obj2) {
    return console.log('object argument missing')
  }
  if(!keys || !keys.length) {
    return console.log('keys argument missing')
  }

  let combined = {};

  keys.forEach((key) => {
    if (obj1[key]) {
      combined[key] = obj1[key];
    } else if (obj2[key]){
      combined[key] = obj2[key];
    } else {
      combined[key] = '';
    }
  })

  return combined;
}

module.exports = {
  combineObjects
}