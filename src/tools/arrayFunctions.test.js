import { removeArticle, addArticle, updateObjInArray } from './arrayFunctions';

const article1 = { _id: 'PMID934534' }
const article2 = { _id: 'PMID987945' }
const article3 = { _id: 'PMID987627' }

const updatedThread = {
  name: 'A newer thread!',
  _id: '456DEF',
  article: article2._id,
  paragraph: 'Now we have a nice, descriptive paragraph for this thread.'
}

const newThread = {
  name: 'A thread with no matches!',
  _id: '9983eh32',
  article: 'PMID928377'
}


describe('Array Functions', () => {

  let collections, threads;
  beforeEach(() => {
    collections = [
      {
        name: 'collection1', articles: [article1, article2, article3]
      },
      {
        name: 'collection2', articles: [article1, article2, article3]
      }
    ]

    threads = [
      {
        name: 'A new thread!',
        _id: '123ABC',
        article: article1._id
      },
      {
        name: 'A newer thread!',
        _id: '456DEF',
        article: article2._id
      },
      {
        name: 'A even newer thread!',
        _id: '789GHF',
        article: article3._id
      }

    ]
  })

  it('should add an article from a collection within an array', () => {
    let newList = addArticle(collections, 'collection1', article1);

    // now there's 3 articles in collection1 again
    expect(newList[0].articles.length).toBe(4);

    // article1 is back in collection1, but its on the end
    expect(newList[0]).toMatchObject({
      name: 'collection1', articles: [article1, article2, article3, article1]
    })

    // collection2 is unchanged
    expect(newList[1]).toMatchObject({
      name: 'collection2', articles: [article1, article2, article3]
    })
  })

  it('should remove an article from a collection within an array', () => {

    let newList = removeArticle(collections, 'collection1', article1);

    // now there's 2 articles in collection1
    // console.log(newList)
    expect(newList[0].articles.length).toBe(2);

    // article1 is gone from collection1
    expect(newList[0]).toMatchObject({
      name: 'collection1', articles: [article2, article3]
    })

    // collection2 is unchanged
    expect(newList[1]).toMatchObject({
      name: 'collection2', articles: [article1, article2, article3]
    })

  })

  it('should replace an object in an array of objects', () => {
    let updatedThreads = updateObjInArray(threads, updatedThread);

    // the first item is unchanged
    expect(updatedThreads[0]).toMatchObject(threads[0]);

    // this one is changed to the new object
    expect(updatedThreads[1]).toMatchObject(updatedThread);

    // the last item is unchanged
    expect(updatedThreads[2]).toMatchObject(threads[2]);

  })

  it('should add an object at the start of an array of objects if no match is found to replace', () => {

    let updatedThreads = updateObjInArray(threads, newThread);

    // the first item in the array is now the newThread
    expect(updatedThreads[0]).toMatchObject(newThread);

    // the three existing threads are unchanged, but with +1 shifted indices
    expect(updatedThreads[1]).toMatchObject(threads[0]);
    expect(updatedThreads[2]).toMatchObject(threads[1]);
    expect(updatedThreads[3]).toMatchObject(threads[2]);

  })

  it('should return an array containing replacementObj for undefined or empty arrays', () => {
    let updatedThreads = updateObjInArray([], newThread);
    expect(updatedThreads).toMatchObject([newThread]);

    updatedThreads = updateObjInArray(undefined, newThread);
    expect(updatedThreads).toMatchObject([newThread]);
  })


})