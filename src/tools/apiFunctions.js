const fetch = require('node-fetch')

// query and return based on date / citations
const getArticles = async (query, sortParam) => {

  // must have a query
  if (!query) return {};

  let allowedSorters = [
    '%20sort_cited:y',
    '%20sort_date:y',
  ];

  // check for bad strings and default to no sorter, which will sort by relevance
  let sorter;
  if (!sortParam) {
    sorter = '';
  } else {
    sorter = `%20sort_${sortParam}:y`;
    if (!allowedSorters.indexOf(sorter)) {
      sorter = '';
    }
  }

  let searchUrl = `https://www.ebi.ac.uk/europepmc/webservices/rest/searchPOST?query=${query}${sorter}&resultType=core&pageSize=10&format=json`;
  
  let headers = {}
  headers['Content-Type'] = 'application/x-www-form-urlencoded';

  let articles = await fetch(searchUrl, {
    method: 'POST',
    headers
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
  let titlesArray = searchResults.resultList.result.map((result) => {
    return result.title;
  })
  return titlesArray;
}

// let results = getArticles('cancer').then((response) => {
//   console.log(response.resultList.result.slice(0,2))
// })

module.exports = {
  getArticles,
  parseSearchToTitlesArray,
}
