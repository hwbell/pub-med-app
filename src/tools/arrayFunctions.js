// this function will remove an article from a specific collection in the collections array
const removeArticle = (collections, collectionName, article) => {

  // find the matching collection and remove the article
  collections.forEach((collection, i) => {

    if (collection.name === collectionName) {
      collection.articles = collection.articles.filter(item => item.id !== article.id)
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

module.exports = {
  removeArticle,
  addArticle
}