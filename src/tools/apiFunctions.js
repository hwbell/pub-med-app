
var ncbi = require('node-ncbi');
var fetch = require('node-fetch')
var parseString = require('xml2js').parseString;

const getNewest = async (query) => {
  let articles = await fetch(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=biology&format=json`, {
    method: 'GET'
  })
    .then(response => response.json())
    .then((response) => {
      // console.log(response)
      return response;
    })
    .catch(err => console.log(err))

  return articles;
}

// parses the result of a search query to a simple array of the article titles
const parseSearchToTitlesArray = (searchResults) => {
  let titlesArray = searchResults.resultList.result.map( (result) => {
    return result.title;
  })
  return titlesArray;
} 

module.exports = {
  getNewest,
  parseSearchToTitlesArray
}


// let results = getNewest().then((result) => {
//   console.log( parseSearchToTitlesArray(result))
// })



// for full text, need a xml parser ... 

// .then(response => response.text())
//     .then((response) => {
//       // console.log(response || 'nothing')
//       parseString(response, function (err, result) {
//         if (err) throw err;

//         console.log(result);
//         return result;
//       });
//     })
