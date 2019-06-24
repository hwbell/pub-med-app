import React from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import ArticleResult from '../ArticleResult';
import CollectionForm from "../CollectionForm";

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

    this.renderLoader = this.renderLoader.bind(this);
    this.toggleCollectionForm = this.toggleCollectionForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = initialState;

  }

  componentDidMount() {

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

  renderResults(collection) {

    const collectionButtons = [
      {
        text: 'view article',
        onClick: this.viewArticle
      },
      {
        text: 'remove',
        onClick: this.handleSubmit
      }
    ];

    return collection.articles.map((article, i) => {
      return (
        <ArticleResult key={i} 
          collection={collection} 
          article={article} 
          buttons={collectionButtons} />
      )
    })

  }

  handleSubmit(article, collection) {
    console.log(`removing article: ${article.id} from user's ${collection.name} collection`);
    
    this.props.modifyCollection(article, collection.name, -1, () => {
      console.log('article added to collection')
    })

  }

  viewArticle(article) {
    console.log(`Viewing article: ${article.id}`)
  }

  toggleCollectionForm() {
    console.log('toggling AddForm')
    this.setState(prevState => ({
      collectionModal: !prevState.collectionModal
    }));
  }

  render() {

    return (
      <div className="search-page page">

        {/* {this.state.selected &&
          <CollectionForm
            article={this.state.selected}
            isVisible={this.state.collectionModal}
            toggle={this.toggleCollectionForm}
            collections={this.props.collections}
            createNewCollection={this.props.createNewCollection}
            addToCollection={this.props.addToCollection} />} */}

        <div className="glass">

          {/* the header */}
          <Header
            class="heading"
            title={"PMC Collections"}
            subtitle={"create & share lists of resources"}
          />

          {/* the results */}

          {/* the results when they appear */}
          {this.props.collections.length > 0 ?
            this.props.collections.map((collection,i) => {

              return (
                <div key={i} className="outline" style={styles.content}>

                  <div className="row" style={styles.collectionTitle}>
                    <p className="article-title">collection: </p>
                    <p className="article-title"><strong>{collection.name}</strong></p>
                  </div>
                  {this.renderResults(collection)}
                </div>
              )

            })
          :
          <div className="outline" style={styles.content}>
            <p className="article-title">
              {`It looks like you haven't made any collections yet! You can add
                articles by searching the database, then organize, export & them here. `}
            </p>
          </div>}




        </div>
      </div>
    );
  }
}

const styles = {
  main: {
    width: '100%'
  },
  collectionTitle: {
    alignSelf: 'flex-start',
    padding: '15px',
  }
}

export default SearchPage;
