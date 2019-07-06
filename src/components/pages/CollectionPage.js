import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import ArticleResult from '../ArticleResult';
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
  pdfReady: false,
  showPreview: false,
  emailModal: false,
  exportSelected: true,
  previewIndex: null
}

class CollectionPage extends React.Component {
  constructor(props) {
    super(props);

    this.renderLoader = this.renderLoader.bind(this);
    this.toggleEmailForm = this.toggleEmailForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = initialState;

  }

  componentDidMount() {
    this.setState({
      pdfReady: true
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
      console.log(`${collection.name} deleted from collecetions`)
    });
  }

  toggleEmailForm() {
    this.setState(prevState => ({
      emailModal: !prevState.emailModal
    }));
  }

  renderCollections(collections, isSaved) {
    return (

      <div className="collection-block">

        <p className="subtitle">{ isSaved ? 'Saved' : 'New' }</p>
        {collections.map((collection, i) => {

          return (
            <Collection
              key={i}
              isSaved={isSaved}
              collection={collection}
              handleSubmit={this.handleSubmit}
              handleDelete={this.handleDelete}
              refreshUserCollections={this.props.refreshUserCollections}
            />
          )

        })}
      </div>
    )
  }

  render() {

    // console.log(JSON.parse(localStorage.getItem('user')))
    // console.log(JSON.parse(localStorage.getItem('token')))

    console.log(this.props)
    const user = this.props.user;

    return (
      <div className="search-page page">

        <div className="glass" >

          {/* the header */}
          <Header
            class="heading"
            title={"PMC Collections"}
            subtitle={"create & share lists of resources"}
          />

          {/* results */}

          {/* the new collections when they are present */}
          {this.props.collections.length > 0 ?

            this.renderCollections(this.props.collections)

            // or if there aren't any collections yet
            :
            <div className="outline" style={styles.content}>
              <p className="paragraph">
                {`It looks like you haven't made any new collections yet! You can add
                articles by searching the database, then organize, share & export them here. `}
              </p>
            </div>}

          {/* the user's collections when they are present */}
          {user && user.collections.length > 0 ?

            this.renderCollections(user.collections, true)

            // or if there aren't any collections yet
            :
            <div className="outline" style={styles.content}>
              <p className="paragraph">
                {`You don't have any collections saved to your profile yet. You can save any new collection you make.
                Just look for the 'save to my collections' button!`}
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
  titleHolder: {
    width: '100%',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.24)'
  },
}

export default CollectionPage;
