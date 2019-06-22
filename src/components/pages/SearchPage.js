import React from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import ArticleResult from '../ArticleResult';
import { Input, Form, InputGroup, Button } from 'reactstrap';

// tools
import { getArticles, parseSearchToTitlesArray } from '../../tools/apiFunctions';

const loadingState = {

}


class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.viewArticle = this.viewArticle.bind(this);
    this.addToCollection = this.addToCollection.bind(this);

    this.state = {
      results: null,
      // articleTitles: null
    };
    
  }

  componentDidMount() {
    getArticles('medicine', 'date')
      .then((response) => {
        console.log(response.resultList.result)
        // let articleTitles = parseSearchToTitlesArray(results);
        this.setState({
          results: response.resultList.result,
          // articleTitles
        })
      }).catch((e) => {
        console.log(e)
      })
  }

  // handleChange changes the value of the current query, in the input
  handleChange(value) {
    this.setState({
      query: value
    });
  }

  // handleSubmit fires the search for the current query
  handleSubmit(e) {
    console.log(`search fired => ${this.state.query}`)
    e.preventDefault();

    this.setState(loadingState, () => {
      this.fetchSearch(this.state.query);
    })

  }

  // get the results from the api
  fetchSearch(query) {
    getArticles('medicine', 'date')
      .then((response) => {
        console.log(response.resultList.result)
        // let articleTitles = parseSearchToTitlesArray(results);
        this.setState({
          results: response.resultList.result,
          // articleTitles
        })
      }).catch((e) => {
        console.log(e)
      })
  }

  renderResults() {

    const searchButtons = [
      {
        text: 'view article',
        onClick: this.viewArticle
      },
      {
        text: 'add to collection',
        onClick: this.addToCollection
      }
    ];

    return this.state.results.map((article, i) => {
      return (
        <ArticleResult key={i} article={article} buttons={searchButtons} />
      )
    })

  }

  viewArticle(article) {
    console.log(`Viewing article: ${article.id}`)
  }

  addToCollection(article) {
    console.log(`Adding article ${article.id} to user's collections`)
  }

  render() {

    return (
      <div className="search-page page">
        <div className="glass">

          <Header
            class="heading"
            title={"PMC Search"}
            subtitle={"abstracts, full text & more"}
          />

          <Form className="search-input" onSubmit={this.handleSubmit}>

            <InputGroup>
              <Input style={{borderRadius: '25px' }} 
                placeholder={this.props.query || "abstracts, full text, patents ..."}
                value={this.props.query}
                onChange={(e) => this.handleChange(e.target.value)}
              />
            </InputGroup>

          </Form>


          <div className="outline" style={styles.content}>

            {this.state.results &&
              this.renderResults()
            }

          </div>



        </div>
      </div>
    );
  }
}

const styles = {
  main: {
    width: '100%'
  },
}

export default SearchPage;
