const collectionServerUrl = process.env.REACT_APP_COLLECTION_SERVER_URL || 'http://localhost:3000/';
const fetch = require('node-fetch');

// get the threads on the server, 10 at a time, according to the sortBy param
export async function getPublicThreads(headers, sortBy, page) {

  if (!sortBy || !page) {
    return console.log('Missing sortBy or page parameter.');
  }
  // page represents results 1-10, 11-20, 21-30, etc. 
  // let url = `${collectionServerUrl}threads/all/${sortBy}/${page}`;
  // let method = 'GET';

  let serverResponse = await Promise.resolve([])

  return serverResponse;
}

// gets a user's profile / collections / threads
export async function getUserCollections(headers) {
  let serverResponse = await Promise.resolve([])

  return serverResponse;
}