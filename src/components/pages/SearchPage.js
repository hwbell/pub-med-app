import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import ArticleResult from '../ArticleResult';
import CollectionForm from "../CollectionForm";
import ArticleViewer from '../ArticleViewer';

import { Input, Form, InputGroup, Button } from 'reactstrap';
import Loader from 'react-loader-spinner';

// tools
import { getArticles, parseSearchToTitlesArray } from '../../tools/apiFunctions';

// animation
import posed, { PoseGroup } from 'react-pose';

// pose containers
const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

const initialState = {
  collectionModal: false,
  articleModal: false,
  results: null,
  showLoading: true
}
const loadingState = {
  results: null,
  showLoading: true
}

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.viewArticle = this.viewArticle.bind(this);
    this.addArticle = this.addArticle.bind(this);
    this.renderLoader = this.renderLoader.bind(this);
    this.toggleCollectionForm = this.toggleCollectionForm.bind(this);
    this.toggleViewArticle = this.toggleViewArticle.bind(this);

    this.state = initialState;

  }

  componentDidMount() {
    getArticles('medicine')
      .then((response) => {
        console.log(response.resultList.result)
        // let articleTitles = parseSearchToTitlesArray(results);
        this.setState({
          results: response.resultList.result,
          showLoading: false
          // articleTitles
        })
      }).catch((e) => {
        console.log(e)
      })
  }

  // handleChange changes the value of the current query, in the input
  handleChange(value) {
    // console.log(value)
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
    getArticles(query)
      .then((response) => {
        console.log(response.resultList.result)
        // let articleTitles = parseSearchToTitlesArray(results);
        this.setState({
          results: response.resultList.result,
          showLoading: false
          // articleTitles
        })
      }).catch((e) => {
        console.log(e)
      })
  }

  renderLoader() {
    return (
      <Div style={styles.loaderHolder} key="loader">
        <Loader
          height={100}
          width={100}
          type="ThreeDots"
          color="whitesmoke"
        />
      </Div>
    )
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

    return this.state.results.map((article, i) => {
      return (
        <ArticleResult key={i} article={article} buttons={searchButtons} />
      )
    })

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

    return (
      <div className="search-page page">

        {/* modal for adding articles to collections. The additions are passed back to App 
          as either new collections or additions to existing collections. pass the current
          collections to the form so it can decide what to render */}
        {this.state.selected &&
          <CollectionForm
            article={this.state.selected}
            isVisible={this.state.collectionModal}
            toggle={this.toggleCollectionForm}
            collections={this.props.collections}
            createNewCollection={this.props.createNewCollection}
            modifyCollection={this.props.modifyCollection} />}

        {/* modal for viewing any article */}
        {this.state.selected &&
          <ArticleViewer
            article={this.state.selected}
            isVisible={this.state.articleModal}
            toggle={this.toggleViewArticle} />}
        
        {/* ************************************************** */}


        {/* **********the main page area************* */}
        <div className="glass">

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
                placeholder={"articles, patents, clinical guidelines ..."}
                onChange={(e) => this.handleChange(e.target.value)}
              />
            </InputGroup>

          </Form>

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
}

export default SearchPage;
