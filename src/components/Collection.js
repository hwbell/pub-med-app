import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, Input, InputGroup, Form } from 'reactstrap';
import ArticleResult from './ArticleResult';
import { PDFViewer } from '@react-pdf/renderer';
import GeneratedPdf from './GeneratedPdf';
import AlertModal from './AlertModal'

// tools
import { saveCollection, deleteCollection } from '../tools/serverFunctions';
import { CSSTransitionGroup } from 'react-transition-group' // ES6

// ******************************************************************************
class Collection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collection: null,
      inputText: '',
      editing: false,
      showPreview: false,
      uniqueWarning: false,
      deleteWarning: false,
      confirming: false
    }

    this.togglePreview = this.togglePreview.bind(this);
    this.postCollection = this.postCollection.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.clearEdits = this.clearEdits.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.toggleUniqueWarning = this.toggleUniqueWarning.bind(this);
    this.toggleDeleteWarning = this.toggleDeleteWarning.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.deleteFromServer = this.deleteFromServer.bind(this);
    this.editSavedCollection = this.editSavedCollection.bind(this);
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing
    }, () => {
      setTimeout(() => {
        console.log(this.state.editing)
        if (this.state.editing) {
          this.focusInput();
        }
      }, 500)
    });

  }

  focusInput() {
    console.log('focusing input')

    this.nameInput.focus();
  }

  togglePreview() {
    this.setState({
      showPreview: !this.state.showPreview
    })
  }

  // to store the value of the input
  handleChange(value) {
    // console.log(value)
    this.setState({
      inputText: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    let collection = JSON.parse(JSON.stringify(this.props.collection))
    collection.name = this.state.inputText;
    this.setState({
      collection
    }, () => {
      this.toggleEdit();
      // console.log(this.state.collection)
    })

  }

  // if it is a new collection, handle delete in state, back in App.
  // if it is a saved collection, delete it from the server 
  handleDelete() {
    let collection = this.props.collection;

    if (!this.props.isSaved) {
      this.props.handleDelete(collection)
    } else {
      console.log('show warning')
      this.toggleDeleteWarning();
    }

  }

  toggleDeleteWarning() {
    this.setState({
      confirming: !this.state.confirming,
      deleteWarning: !this.state.deleteWarning
    })
  }

  // this will delete a collection from the server and send the response
  deleteFromServer() {

    let collection = this.props.collection;

    let token = JSON.parse(localStorage.getItem('token'));

    let headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    // Delete the collection from the server
    return deleteCollection(collection, headers)
      .then((response) => {
        console.log(response)

        // once we have successfully deleted, we will: 

        // 1. Refresh the user's collections - this will send the new collection list sent back
        // from the server to the root App component to update all concerned components
        this.props.refreshUserCollections(response);

        // toggle the modal - it should always be up at this point
        this.state.deleteWarning && this.toggleDeleteWarning();

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  // this function is called from the 'remove' button in ArticleResult if it is a saved collection.
  // New collections, i.e. state collections, use this.props.modifyCollection() assigned 
  // to the 'remove' button to adjust state. But for a saved collection, we will tell the server 
  // with the postCollection() function below  

  editSavedCollection(article) {

    // create a state collection with props if it isn't in state yet, 
    // otherwise grab the state collection. We use the collection in state as a holder for 
    // changes that the user can save. This function makes changes in the UI, but doesn't 
    // save them to the server.  
    let collection = JSON.parse(JSON.stringify(this.state.collection || this.props.collection));

    let name = collection.name;
    console.log(`removing article ${article.id} saved collection ${name}`)

    collection.articles = collection.articles.filter(item => item.id !== article.id)

    this.setState({
      collection
    })
  }

  postCollection() {

    // if this.state.collection (edited from this.props.collection) exists, we will send it to the server as a patch
    // otherwise it is treated as a newly posted collection in the saveCollection function
    let collection = this.state.collection || this.props.collection;

    let token = JSON.parse(localStorage.getItem('token'));

    let headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    let isExisting = !!this.state.collection && this.props.isSaved;

    // Post the collection to save it to the server. Using the currently stored token
    // will assign the user as the owner of the collection in mongodb on the backend
    return saveCollection(collection, headers, isExisting)
      .then((response) => {
        console.log(response)

        // this will be the response for non-unique names
        if (response.code === 11000) {
          return this.toggleUniqueWarning();
        }

        // once we have successfully posted, we will: 

        // 1. Refresh the user's collections - this will send the new collection list sent back
        // from the server to the root App component to update all concerned components
        this.props.refreshUserCollections(response);

        // 2. Remove this collection from the 'New Collections' list, if that's where it came from 
        !isExisting && this.props.handleDelete(this.props.collection);

        this.setState({
          collection: null
        })

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  renderResults(collection) {
    // console.log(collection)
    const collectionButtons = [
      {
        text: 'view article',
        onClick: this.props.viewArticle
      },
      {
        text: 'remove',
        onClick: collection.owner ? this.editSavedCollection : this.props.modifyCollection
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

  renderTitle() {
    console.log('rendering title')
    // console.log(this.state.collection)
    // console.log(this.props.collection)

    let collection = this.state.collection || this.props.collection;
    let title = collection.name;
    return (
      <div style={styles.title}>
        <p className="collection-title">
          <strong>{`${title} `}</strong>{` (${collection.articles.length})`}
        </p>
        <i className="far fa-edit"
          onClick={this.toggleEdit}></i>
      </div>
    )
  }

  renderInput() {

    let collection = this.state.collection || this.props.collection;
    let placeholder = collection.name

    return (
      <div style={styles.title}>
        <Form onSubmit={this.handleSubmit}>
          <div style={styles.titleHolder}>
            <Input type="text" name="text" id="exampleEmail" className="collection-edit"
              placeholder={placeholder}
              onChange={(e) => this.handleChange(e.target.value)}
              ref={(input) => { this.nameInput = input }} >
            </Input>
            <i className="fas fa-times"
              onClick={this.toggleEdit}></i>
          </div>
        </Form>
      </div>
    )
  }

  // to show the save icon upon editing
  renderSaveOption() {
    return (
      <div style={styles.iconHolder}>
        <i className="far fa-save" style={styles.icon}
          onClick={this.postCollection}></i>
        <i className="fas fa-undo" style={styles.icon}
          onClick={this.clearEdits}></i>
      </div>
    )
  }

  clearEdits() {

    this.setState({
      collection: null
    }, () => {
      console.log('clearing edits')
    })
  }


  toggleUniqueWarning() {
    this.setState({
      uniqueWarning: !this.state.uniqueWarning
    })
  }

  // use the AlertModal for each of the alerts, just use different props
  renderAlertModals() {
    let uniqueWarningProps = {
      message: 'Each collection must have a unique name! Try adjusting the name.',
      isVisible: this.state.uniqueWarning,
      confirming: this.state.confirming,
      confirm: this.toggleUniqueWarning,
      toggle: this.toggleUniqueWarning
    }
    let deleteCollectionWarningProps = {
      message: `Are you sure you want to delete this collection?`,
      isVisible: this.state.deleteWarning,
      confirming: this.state.confirming,
      confirm: this.deleteFromServer,
      toggle: this.toggleDeleteWarning
    }
    // let deleteArticleWarningProps = {
    //   message: `Are you sure you want to remove this article?`,
    //   isVisible: this.state.deleteWarning,
    //   confirming: this.state.confirming,
    //   confirm: this.props.handleDelete,
    //   toggle: this.toggleDeleteWarning
    // }

    let propSets = [uniqueWarningProps, deleteCollectionWarningProps];

    return propSets.map((props, i) => {
      return <AlertModal key={i} {...props} />
    })
  }

  render() {

    console.log(this.props.collection)
    console.log(this.state.collection)

    // if there is a collection in state, this means changes have been made and the props
    // one copied to state to be edited
    let collection = this.state.collection || this.props.collection;

    return (
      <div className="outline collection" style={styles.content}>

        {/* the save icon that appears once we have any edits */}
        {this.state.collection && this.props.isSaved &&
          this.renderSaveOption()
        }

        {/* the modals to alert for non-unique properties / deletions */}
        {this.renderAlertModals()}

        {/* User can toggle here to edit the title of a collection */}
        <div style={styles.titleRow}>
          <CSSTransitionGroup
            style={styles.titleHolder}
            transitionName="replace"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>


            {!this.state.editing &&
              this.renderTitle()}
            {this.state.editing &&
              this.renderInput()}
            {/* preview / download options for the article */}

          </CSSTransitionGroup>
        </div>

        <CSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>


          <div style={styles.buttonHolder}>
            <Button
              style={styles.button}
              color="link" size="md"
              onClick={this.togglePreview}>
              <i className={!this.state.showPreview ? 'far fa-file-pdf' : 'far fa-window-close'}></i>
            </Button>
            {!this.props.isSaved &&
              <Button
                style={styles.button}
                color="link" size="md"
                onClick={this.postCollection}>
                <i className="far fa-save"></i>
              </Button>}
            <Button
              style={styles.button}
              color="link" size="md"
              onClick={this.handleDelete}>
              <i className="warn-icon fas fa-trash"></i>
            </Button>

          </div>

          {/* the pdf, when the preview button is clicked */}
          {this.state.showPreview &&
            <div ref={this.props.ref} key="pdf" className="pdf-holder">
              <PDFViewer className="pdf-viewer">
                <GeneratedPdf collection={collection} />
              </PDFViewer>
            </div>}

          {/* the articles in the collection, in ArticleResult format */}
          {!this.state.showPreview &&
            <div ref={this.props.ref} key="results" className="results-holder">
              {this.renderResults(collection)}
            </div>}

        </CSSTransitionGroup>

      </div>

    );
  }
}

const styles = {
  titleRow: {
    width: '100%',
    height: '40px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleHolder: {
    // padding: '20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonHolder: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    position: 'absolute',
    top: '0px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  iconHolder: {
    position: 'absolute',
    right: '20px',
    zIndex: 10,
    padding: '10px',
  },
  icon: {
    fontSize: '16px',
    padding: '10px',
  },
  button: {
    fontSize: '16px'
  }
}

export default Collection;
