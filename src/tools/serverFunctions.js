const makeRandomString = require('./stringFunctions').makeRandomString;

const collectionServerUrl = process.env.REACT_APP_COLLECTION_SERVER_URL || 'http://localhost:8080/';
const fetch = require('node-fetch');


const signInUser = async (user) => {
  if (!user) {
    return;
  }

  let headers = {}
  headers['content-type'] = 'application/application/json';

  let response = await fetch(`${collectionServerUrl}users`, {
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
let user = {
  "name": makeRandomString(6),
  "password": makeRandomString(8),
  "email": `${makeRandomString(6)}@example.com`,
  "age": 25
}
let collection = {
	"name":"articles about science",
	"articles": [
		{
			"url": "http://nature/bio/moggetarticle1"
		},
		{
			"url": "http://nature/bio/moggetarticle2"
		},
		{
			"url": "http://nature/bio/moggetarticle3"
		}
	]
}

// let signInAttempt = signInUser(user).then((response) => {
  
//   console.log(localStorage.token)
// })

module.exports = {
  signInUser
}