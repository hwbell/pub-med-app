
// this comibines two objects for the keys specified, giving priority to obj1
const combineObjects = (obj1, obj2, props) => {

  console.log(obj1)
  console.log(obj2)

  if(!obj1 || !obj2) {
    return console.log('object argument missing')
  }
  if(!props || !props.length) {
    return console.log('keys argument missing')
  }

  let combined = {};

  props.forEach((prop) => {
    if (obj1[prop]) {
      combined[prop] = obj1[prop];
      

    } else if (obj2[prop]){
      combined[prop] = obj2[prop];
   
    } else {
      combined[prop] = '';
    }
    // console.log(combined[prop])
  })

  // console.log(combined)

  return combined;
}

module.exports = {
  combineObjects
}