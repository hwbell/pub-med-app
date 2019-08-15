
// this comibines two objects for the keys specified, giving priority to obj1
const combineObjects = (obj1, obj2, props) => {

  console.log(obj1)
  console.log(obj2)

  if (!obj1 || !obj2) {
    return console.log('object argument missing')
  }
  if (!props || !props.length) {
    return console.log('keys argument missing')
  }

  let combined = {};

  props.forEach((prop) => {
    if (obj1[prop]) {
      combined[prop] = obj1[prop];


    } else if (obj2[prop]) {
      combined[prop] = obj2[prop];

    } else {
      combined[prop] = '';
    }
    // console.log(combined[prop])
  })

  // console.log(combined)

  return combined;
}

function extractStringDate(date) {

  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  let year = date.getFullYear().toString().slice(2);
  let hours = date.getHours() < 13 ? date.getHours().toString() : (date.getHours() - 12).toString();
  let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes().toString(): date.getMinutes().toString();

  let timeOfDay = date.getHours() > 11 ? 'pm' : 'am';

  return `${month}-${day}-${year} @ ${hours}:${minutes}${timeOfDay}`;
}

module.exports = {
  combineObjects,
  extractStringDate
}