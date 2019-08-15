import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import ArticleViewer from '../ArticleViewer';
import EmailForm from "../EmailForm";
import Collection from '../Collection';
import { ButtonGroup, Button } from 'reactstrap';
import Loader from 'react-loader-spinner';

// animation
import posed, { PoseGroup } from 'react-pose';

// pose containers
const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

const initialState = {
  sorter: 'createdAt',
  showPreview: false,
  emailModal: false,
  articleModal: false,
  exportSelected: true,
  previewIndex: null
}

class CollectionPage extends React.Component {
  constructor(props) {
    super(props);

    this.renderLoader = this.renderLoader.bind(this);
    this.renderSorters = this.renderSorters.bind(this);
    this.handleSortButton = this.handleSortButton.bind(this);
    this.sortCollections = this.sortCollections.bind(this);

    this.toggleEmailForm = this.toggleEmailForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.viewArticle = this.viewArticle.bind(this);
    this.toggleViewArticle = this.toggleViewArticle.bind(this);

    this.state = initialState;

  }

  // the sorter is already set to a property of any collection, so we can use
  // it directly below 
  sortCollections() {
    let collections = JSON.parse(JSON.stringify(this.props.user.collections));
    let { sorter } = this.state;

    collections = collections.sort((a, b) => {
      console.log(a[sorter], b[sorter])
      if (sorter === 'name') {
        return a[sorter] > b[sorter] ? 1 : -1;
      } else {
        return a[sorter] < b[sorter] ? 1 : -1;
      }
    });

    this.props.refreshUserCollections(collections);
  }

  handleSortButton(sorter) {
    // update local storage
    localStorage.setItem('collectionSorter', JSON.stringify(sorter))

    // update the state    
    this.setState({
      sorter
    }, () => {
      // sort 'em
      this.sortCollections();

    })
  }

  // the buttons to sort by date, citations, etc
  renderSorters() {
    let sortButtons = [
      {
        text: 'newest',
        sorter: '_id'
      },
      {
        text: '#of articles',
        sorter: 'articlesCount'
      },
      {
        text: 'name',
        sorter: 'name'
      },
    ];

    return (

      <div className="left-all-row" style={{ padding: '0px 24px' }}>
        <p style={{fontSize: '12px', padding: '5px'}}>sort by:</p>

        {sortButtons.map((button, i) => {

          let isLocalSorter = JSON.parse(localStorage.getItem('collectionSorter')) === button.sorter;

          let color;
          if (isLocalSorter) {
            color = 'blue';
          } else {
            color = 'white';
          }
          return <Button key={i} style={{ color }} className="sort-link" color="link" size="sm"
            onClick={() => this.handleSortButton(button.sorter)}>{button.text}</Button>
        })}
      </div>
    )
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

  // for removing articles, registers the removal in App
  handleSubmit(article, collection) {
    console.log(`removing article: ${article.id} from user's ${collection.name} collection`);

    this.props.modifyCollection(article, collection.name, -1, () => {
      console.log('article removed from collection')
    })
  }

  // deletes the entire collection, registers the removal in App
  handleDelete(collection) {
    this.props.deleteCollection(collection, () => {
      console.log(`${collection.name} deleted from collections`)
    });
  }

  toggleEmailForm() {
    this.setState(prevState => ({
      emailModal: !prevState.emailModal
    }));
  }

  viewArticle(article) {
    console.log(`Viewing article: ${article.id}`)

    this.setState({
      selected: article
    }, () => {
      this.toggleViewArticle();
    })
  }
  toggleViewArticle() {
    console.log('toggling ArticleViewer')
    this.setState(prevState => ({
      articleModal: !prevState.articleModal
    }));
  }

  renderCollections(collections, isSaved) {
    return (

      <div className="collection-block">
        {isSaved && this.renderSorters()}

        {collections.map((collection, i) => {

          return (
            <Collection
              key={i}
              isSaved={isSaved}
              collection={collection}
              handleSubmit={this.handleSubmit}
              handleDelete={this.handleDelete}
              modifyCollection={this.props.modifyCollection}
              refreshUserCollections={this.props.refreshUserCollections}
              viewArticle={this.viewArticle}
            />
          )

        })}
      </div>
    )
  }

  render() {

    // console.log(JSON.parse(localStorage.getItem('collections')))

    // get the user's saved collections
    const user = this.props.user;
    const haveUserCollections = user && user.collections && user.collections.length > 0;

    // get the new collections
    const newCollections = this.props.collections.length > 0 ?
      this.props.collections :
      JSON.parse(localStorage.getItem('collections'));
    const haveNewCollections = newCollections && newCollections.length > 0;

    // console.log(haveUserCollections, haveNewCollections)

    return (
      <div className="collection-page page">

        {/* modal for viewing any article */}
        {this.state.selected &&
          <ArticleViewer
            article={this.state.selected}
            isVisible={this.state.articleModal}
            toggle={this.toggleViewArticle} />}

        <div className="glass page-content" >

          {/* the header */}
          <Header
            class="heading"
            title={"PMC Collections"}
            subtitle={"create & save a record of your research"}
          />

          {/* results */}

          <div className="outline" style={styles.content}>

            <p className="profile-title">New Collections</p>

            {/* the new collections when they are present */}
            {haveNewCollections ?

              this.renderCollections(newCollections, false)

              // or if there aren't any collections yet
              :
              <p className="paragraph">
                {`You don't have any new collections made. You can create some by searching
                 the database and adding any interesting articles to your collection. Then you can
                  organize, share & export them here. `}
              </p>
            }

            <p className="profile-title">Saved Collections</p>

            {/* the user's collections when they are present */}
            {haveUserCollections ?

              this.renderCollections(user.collections, true)

              // or if there aren't any collections yet
              :
              <p className="paragraph">
                {`You don't have any collections saved to your profile yet. You can save any new collection you make.
                Just look for the 'save to my collections' button!`}
              </p>
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
  titleHolder: {
    width: '100%',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.24)'
  },
}

export default CollectionPage;

