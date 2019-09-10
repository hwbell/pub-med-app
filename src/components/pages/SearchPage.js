import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import ArticleResult from '../ArticleResult';
import CollectionForm from "../CollectionForm";
import ArticleViewer from '../ArticleViewer';

import { Input, Form, InputGroup, Button, Collapse } from 'reactstrap';
import Loader from 'react-loader-spinner';

// tools
import { getArticles } from '../../tools/apiFunctions.js';

// animation
import posed, { PoseGroup } from 'react-pose';

// pose containers
const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

const initialState = {
  query: 'neuron',
  sorter: '',
  collectionModal: false,
  articleModal: false,
  results: null,
  showLoading: true,
  showMoreResults: false
}
const loadingState = {
  results: null,
  showLoading: true,
  showMoreResults: false
}

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.fetchSearch = this.fetchSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSortButton = this.handleSortButton.bind(this);

    this.renderLoader = this.renderLoader.bind(this);
    this.renderSorters = this.renderSorters.bind(this);

    this.viewArticle = this.viewArticle.bind(this);
    this.addArticle = this.addArticle.bind(this);
    this.toggleCollectionForm = this.toggleCollectionForm.bind(this);
    this.toggleViewArticle = this.toggleViewArticle.bind(this);
    this.toggleShowMoreResults = this.toggleShowMoreResults.bind(this);


    this.state = initialState;

  }

  // on mounting, check for localStorage results from previous searches. 
  // we should fetch articles with our default sorters if the user has not
  // performed any searches yet. 
  componentDidMount() {

    // assign the sorter to local storage
    localStorage.setItem('sorter', JSON.stringify(this.state.sorter));

    let localResults = JSON.parse(localStorage.getItem('searchResults'));

    if (!localResults || !localResults.length) {
      let { query, sorter } = this.state;

      return this.fetchSearch(query, sorter);
    } else {
      // if we have the localStorage results, set them as the results and cancel the loader icon
      this.setState({
        showLoading: false,
        query: JSON.parse(localStorage.getItem('searchQuery')),
        results: JSON.parse(localStorage.getItem('searchResults'))
      })
    }
  }

  // get the results from the api
  fetchSearch(query, sorter) {
    return getArticles(query, sorter)
      .then((response) => {
        // console.log(response.resultList.result)
        // let articleTitles = parseSearchToTitlesArray(results);
        this.setState({
          results: response.resultList.result,
          showLoading: false
          // articleTitles
        }, () => {
          // save the search to local storage
          localStorage.setItem('searchResults', JSON.stringify(response.resultList.result));
          localStorage.setItem('searchQuery', JSON.stringify(query));
        })

      }).catch((e) => {
        // console.log(e)
        this.setState({
          error: e
        })
      })
  }

  // handleChange changes the value of the current query, in the input
  handleChange(value) {

    if (!value) {
      value = ` `;
    } 
    this.setState({
      query: value
    });
  }

  // handleSubmit fires the search for the current query
  handleSubmit(e) {
    console.log(`search fired => ${this.state.query}, ${this.state.sorter}`)
    e.preventDefault();

    // set to loading state, and fetch the search
    this.setState(loadingState, () => {
      let { query, sorter } = this.state
      this.fetchSearch(query, sorter);
    })
  }

  // date, cited, relevance buttons will re-fetch the search, since we will get 
  // totally different results based on these. 
  handleSortButton(sorter) {
    loadingState.sorter = sorter;
    this.setState(loadingState, () => {
      let { query } = this.state;
      this.fetchSearch(query, sorter)

      localStorage.setItem('sorter', JSON.stringify(sorter))

    })

  }

  renderLoader() {
    return (
      <div style={styles.loaderHolder} id="loader" key="loader">
        <Loader
          height={100}
          width={100}
          type="Ball-Triangle"
          color="whitesmoke"
        />
      </div>
    )
  }

  toggleShowMoreResults() {
    this.setState({
      showMoreResults: !this.state.showMoreResults
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
        onClick: this.addArticle
      }
    ];

    // split the results and put moreResults into the Collapse element, controlled
    // by the show more button
    let topResults = this.state.results.slice(0,10);
    let moreResults = this.state.results.slice(10);
    return (
      <div className="center-all-col">
        {topResults.map((article, i) => {
          return (
            <ArticleResult key={i} index={i+1} article={article} buttons={searchButtons} />
          )
        })}

        <Collapse isOpen={this.state.showMoreResults}>
          {moreResults.map((article, i) => {
            return (
              <ArticleResult key={i} index={i+11} article={article} buttons={searchButtons} />
            )
          })}
        </Collapse>

        <Button size="sm" color="link" className="article-button"
          style={{fontSize: '20px'}}
          onClick={this.toggleShowMoreResults}>
          <i className={this.state.showMoreResults ? 'fas fa-angle-double-up': 'fas fa-angle-double-down'}></i>
        </Button>

      </div>
    )

  }

  // the buttons to sort by date, citations, etc
  renderSorters() {
    let sortButtons = [
      {
        text: '1st author',
        sorter: 'AUTH_FIRST'
      },
      {
        text: 'date',
        sorter: 'P_PDATE_D'
      },
      {
        text: 'cited',
        sorter: 'CITED'
      },
      {
        text: 'relevance',
        sorter: ''
      }
    ];

    return (

      <div className="left-all-row" style={{ padding: '0px 24px' }}>
        <p style={{margin: '5px', fontSize: '12px'}}>sort by:</p>

        {sortButtons.map((button, i) => {

          let isLocalSorter = JSON.parse(localStorage.getItem('sorter')) === button.sorter;
          {/* let isStateSorter = this.state.sorter === button.sorter; */ }

          let color;
          if (isLocalSorter) {
            color = 'rgb(29, 120, 223)';
          } else {
            color = 'white';
          }
          return <Button key={i} style={{ color }} className="sort-link" color="link" size="sm"
            onClick={() => this.handleSortButton(button.sorter)}>{button.text}</Button>
        })}
      </div>
    )
  }

  addArticle(article) {
    console.log(`adding article: ${article.id}`);

    this.setState({
      selected: article
    }, () => {
      this.toggleCollectionForm();
    })

  }

  viewArticle(article) {
    console.log(`Viewing article: ${article.id}`)

    this.setState({
      selected: article
    }, () => {
      this.toggleViewArticle();
    })
  }

  toggleCollectionForm() {
    console.log('toggling AddForm')
    this.setState(prevState => ({
      collectionModal: !prevState.collectionModal
    }));
  }

  toggleViewArticle() {
    console.log('toggling AddForm')
    this.setState(prevState => ({
      articleModal: !prevState.articleModal
    }));
  }

  render() {

    // console.log(this.props.collections)

    return (
      <div className="page">

        {/* modal for adding articles to collections. The additions are passed back to App 
          as either new collections or additions to existing collections. pass the current
          collections to the form so it can decide what to render */}
        {this.state.selected &&
          <CollectionForm
            user={this.props.user}
            article={this.state.selected}
            isVisible={this.state.collectionModal}
            toggle={this.toggleCollectionForm}
            collections={this.props.collections}
            createNewCollection={this.props.createNewCollection}
            modifyCollection={this.props.modifyCollection} 
            refreshUserCollections={this.props.refreshUserCollections}
            />}

        {/* modal for viewing any article */}
        {this.state.selected &&
          <ArticleViewer
            article={this.state.selected}
            isVisible={this.state.articleModal}
            toggle={this.toggleViewArticle} />}

        {/* ************************************************** */}


        {/* **********the main page area************* */}
        <div className="glass page-content">

          {/* the header */}
          <Header
            class="heading"
            title={"PMC Search"}
            subtitle={"abstracts, full text & more"}
          />

          {/* the search input form */}
          <Form className="search-input" onSubmit={this.handleSubmit}>

            <InputGroup>
              <Input style={{ borderRadius: '25px' }}
                // value is set to one of these values, state or local or ''
                value={this.state.query || JSON.parse(localStorage.getItem('searchQuery')) || ''}
                placeholder={"articles, patents, clinical guidelines ..."}
                onChange={(e) => this.handleChange(e.target.value)}
              />
            </InputGroup>

          </Form>

          {/* the sorting options */}
          {this.renderSorters()}

          {/* the results */}
          <div className="outline" style={styles.content}>

            {/* the loading icon */}
            {this.state.showLoading &&
              this.renderLoader()
            }
            {/* the results when they appear */}
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
  content: {
    minHeight: '80vh'
  },
  loaderHolder: {
    marginTop: '20px'
  }
}

export default SearchPage;
