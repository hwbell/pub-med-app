import { removeArticle, addArticle } from './arrayFunctions';

const article1 = {id: 'article1'}
const article2 = {id: 'article2'}
const article3 = {id: 'article3'}

describe('Array Functions', () => {

  it('should add and remove an article from a collection within an array', () => {
    const collections = [
      {
        name: 'collection1', articles: [article1, article2, article3]
      },
      {
        name: 'collection2', articles: [article1, article2, article3]
      }
    ]

    let newList = removeArticle(collections, 'collection1', article1);
    
    // now there's 2 articles in collection1
    expect(newList[0].articles.length).toBe(2);

    // article1 is gone from collection1
    expect(newList[0]).toMatchObject({
      name: 'collection1', articles: [article2, article3]
    })

    // collection2 is unchanged
    expect(newList[1]).toMatchObject({
      name: 'collection2', articles: [article1, article2, article3]
    })

    newList = addArticle(collections, 'collection1', article1);

    // now there's 3 articles in collection1 again
    expect(newList[0].articles.length).toBe(3);

    // article1 is back in collection1, but its on the end
    expect(newList[0]).toMatchObject({
      name: 'collection1', articles: [article2, article3, article1 ]
    })

    // collection2 is unchanged
    expect(newList[1]).toMatchObject({
      name: 'collection2', articles: [article1, article2, article3]
    })

  })
  

})