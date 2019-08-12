const fetch = require('node-fetch')

// query and return based on date / citations
export async function getArticles (query, sortParam) {

  // must have a query
  if (!query) return {};

  let allowedSorters = [
    '&sort=P_PDATE_D%20asc',
    '&sort=AUTH_FIRST%20asc',
    '&sort=CITED%20asc',
    '&sort=RELEVANCE%20asc',
  ];

  // check for bad strings and default to no sorter, which will sort by relevance
  let sorter;
  if (!sortParam) {
    sorter = '';
  } else {
    sorter = `&sort=${sortParam}%20asc`;
    if (!allowedSorters.indexOf(sorter)) {
      sorter = '';
    }
  }

  let searchUrl = `https://www.ebi.ac.uk/europepmc/webservices/rest/searchPOST?query=${query}${sorter}&resultType=core&pageSize=50&format=json`;
  
  console.log(searchUrl)
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
export function parseSearchToTitlesArray (searchResults) {
  let titlesArray = searchResults.resultList.result.map((result) => {
    return result.title;
  })

  return titlesArray;
}

// let results = getArticles('cancer').then((response) => {
//   console.log(response.resultList.result.slice(0,2))
// })

// module.exports = {
//   getArticles,
//   parseSearchToTitlesArray,
// }
