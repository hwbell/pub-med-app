
// set some sample data for tests

export function getSampleCollections() {
  let collections = [];
  for (let i = 0; i < 10; i++) {
    collections.push({
      name: `collection ${i + 1}`,
      _id: i + 1,
      owner: `user_${i + 1}`,
      articles: [
        {
          name: `article ${i + 1}`,
          name: `article ${i + 2}`,
          name: `article ${i + 3}`,
        }
      ],
      articlesCount: Math.floor(Math.random()*100)
    })
  }
  return collections;
}