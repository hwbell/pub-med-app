const makeRandomString = require('./stringFunctions').makeRandomString;

const collectionServerUrl = process.env.REACT_APP_COLLECTION_SERVER_URL || 'http://localhost:8080/';
const fetch = require('node-fetch');


export async function signInUser (user, isNewUser) {
  if (!user) {
    return;
  }

  let headers = {}
  headers['content-type'] = 'application/application/json';

  let url = isNewUser ? `${collectionServerUrl}users` : `${collectionServerUrl}users/login`;
  let response = await fetch( url, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then((response) => {
      // console.log(response)
      return response;
    })
    .catch(err => console.log(err))

  return response;
}

// saves a collection to the server
export async function saveCollection (collection, headers) {

  let serverResponse = await fetch(`${collectionServerUrl}collections`, {
    method: 'POST',
    body: JSON.stringify(collection),
    headers
  })
    .then(response => response.json())
    .then((json) => {
      // console.log(response)
      return json;
    })
    .catch(err => console.log(err))

  return serverResponse;
}

export async function getUserCollections(headers) {
  let serverResponse = await fetch(`${collectionServerUrl}collections/me`, {
    method: 'GET',
    headers
  })
    .then(response => response.json())
    .then((json) => {
      // console.log(response)
      return json;
    })
    .catch(err => console.log(err))

  return serverResponse;
}
// let user = {
//   "name": makeRandomString(6),
//   "password": makeRandomString(8),
//   "email": `${makeRandomString(6)}@example.com`,
//   "age": 25
// }
// let collection = {
//   "name": "articles about science",
//   "articles": [
//     {
//       "url": "http://nature/bio/moggetarticle1"
//     },
//     {
//       "url": "http://nature/bio/moggetarticle2"
//     },
//     {
//       "url": "http://nature/bio/moggetarticle3"
//     }
//   ]
// }

// let signInAttempt = signInUser(user).then((response) => {

//   console.log(localStorage.token)
// })

// let headers = {
//   Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDFhN2VlMTkzYmI0ZTQyZWM1Mjk5MmQiLCJpYXQiOjE1NjIwMTc1MDV9.AT5W-Vu8LssYs3fmH3IpnWSbQFxS0zk8S2WdW-2OAcs',
//   Accept: 'application/json',
//   'Content-Type': 'application/json',
// }
// let saveCollectionAttempt = saveCollection(collection, headers).then((response) => {
//   // 
//   console.log(response);
// })


// module.exports = {
//   signInUser,
//   saveCollection
// }