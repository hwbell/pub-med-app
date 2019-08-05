// this function will remove an article from a specific collection in the collections array
const removeArticle = (collections, collectionName, article) => {

  // find the matching collection and remove the article
  collections.forEach((collection, i) => {

    if (collection.name === collectionName) {
      collection.articles = collection.articles.filter(item => item._id !== article._id)
    }

  });

  return collections;
}

// this function will add an article to a specific collection
const addArticle = (collections, collectionName, article) => {

  // find the matching collection and remove the article
  collections.forEach((collection, i) => {

    if (collection.name === collectionName) {
      collection.articles.push(article);
    }

  });

  return collections;
}

// this will either: 

// find the object with matching properties of replacementObj within an array of objects, 
// and replace it with replacementObj
// OR
// if a match is not found, this will just add the object to the array, at the 0 index
// useful for dealing with patch responses.

const updateObjInArray = (array, replacementObj) => {
  
  // if the array is undefined or empty, return an array containing replacementObj
  if (!array || !array.length) {
    return [replacementObj];
  }

  // otherwise, attempt to find and replace
  let arrayCopy = array.slice();
  let replaced = false;
  arrayCopy.forEach((obj, i) => {
    // console.log(i)
    let idsMatch = obj._id === replacementObj._id;
    let ownersMatch = obj.owner === replacementObj.owner;

    if (idsMatch && ownersMatch) {
      // console.log(`found a match @ ${i}`)
      arrayCopy[i] = replacementObj;
      replaced = true;
    }

  });

  // if there was no replacement, just add it to the start of the array
  if (!replaced) {
    arrayCopy.unshift(replacementObj);
  }
  // console.log(array)

  return arrayCopy;
}

module.exports = {
  removeArticle,
  addArticle,
  updateObjInArray
}