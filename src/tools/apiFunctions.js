
var ncbi = require('node-ncbi');
var fetch = require('node-fetch')
var parseString = require('xml2js').parseString;

// query and return based on date / citations
const getArticles = async (query, sortParam) => {

  // must have a query
  if (!query) return {};
  
  let allowedSorters = [
    '%20sort_cited:y',
    '%20sort_date:y',
  ];

  // check for bad strings and default to no sorter, which will sort by relevance
  let sorter = `%20sort_${sortParam}:y`;
  if ( !allowedSorters.indexOf(sorter) ) {
    sorter = '';
  }


  let articles = await fetch(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${query}${sorter}&format=json`, {
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
  getArticles,
  parseSearchToTitlesArray
}


let results = getArticles('biology', 'date').then((result) => {
  // console.log( parseSearchToTitlesArray(result))
})



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
