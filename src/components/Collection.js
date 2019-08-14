import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, Collapse, Input, Form, Fade } from 'reactstrap';
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
      showContent: false,
      collection: null,
      inputText: '',
      editing: false,
      showPreview: false,
      uniqueWarning: false,
      deleteWarning: false,
      confirming: false,
      showPopup: false,
      renderPopup: false,
      popupMessage: 'make a pdf!',
      modalProps: {}
    }
    this.toggleContent = this.toggleContent.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.toggleAlertModal = this.toggleAlertModal.bind(this);
    this.postCollection = this.postCollection.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.clearEdits = this.clearEdits.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.toggleUniqueWarning = this.toggleUniqueWarning.bind(this);
    this.toggleDeleteWarning = this.toggleDeleteWarning.bind(this);
    this.deleteNewCollection = this.deleteNewCollection.bind(this);
    this.deleteFromServer = this.deleteFromServer.bind(this);
    this.editSavedCollection = this.editSavedCollection.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  componentDidMount() {
    this.setState({
      renderPopup: true,
      modalProps: {
        isVisible: false,
        confirming: false,
        toggle: this.toggleAlertModal
      }
    })
  }

  toggleContent() {
    this.setState({
      showContent: !this.state.showContent
    });
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

    if (value === '') {
      value = ` `
    }
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

  // if it is a new collection, handle delete in state and register back in App.
  deleteNewCollection() {
    this.props.handleDelete(this.props.collection);
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

        let { modalProps } = this.state;
        modalProps.isVisible = !modalProps.isVisible;
        this.setState({modalProps});

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
          index={i + 1}
          collection={collection}
          article={article}
          buttons={collectionButtons} />
      )
    })

  }

  renderTitle() {
    // console.log('rendering title')
    // console.log(this.state.collection)
    // console.log(this.props.collection)

    let collection = this.state.collection || this.props.collection;
    let title = collection.name;
    // console.log(collection)
    return (
      <div style={styles.title}>
        <p className="thread-title">
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
              value={this.state.inputText || this.props.collection.name}
              onChange={(e) => this.handleChange(e.target.value)}
              ref={(input) => { this.nameInput = input }} >
            </Input>
            <i className="far fa-times-circle"
              onClick={this.toggleEdit}></i>
            <i className="far fa-check-circle"
              onClick={this.handleSubmit}></i>
          </div>
        </Form>
      </div>
    )
  }

  // this is for the buttons below, to explain the icons
  togglePopup(str) {
    if (str) {
      this.setState({
        popupMessage: str,
        showPopup: true
      })
    } else {
      this.setState({
        showPopup: false
      })
    }
  }

  // the buttons for export, save, delete
  renderButtons() {
    // the user can only post the collection with this save button below
    // if they are logged in and it is a new collection
    let userCanSave = !this.props.isSaved && !!JSON.parse(localStorage.getItem('user'));
    // console.log(userCanSave)    
    return (
      <div className="left-all-col">

        {/* the content expander button */}
        <Button
          style={styles.expandButton}
          color="link" size="md"
          onClick={this.toggleContent}>
          <i className={this.state.showContent ? "fas fa-angle-double-up" : "fas fa-angle-double-down"}></i>
        </Button>

        <Fade in={this.state.showPopup} style={styles.popupText}>
          {this.state.popupMessage}
        </Fade>

        <div style={styles.buttonHolder}>
          <Button
            style={styles.button}
            color="link" size="md"
            onClick={this.togglePreview}
            onMouseOver={() => this.togglePopup('make a pdf!')}
            onMouseLeave={() => this.togglePopup('')}>
            <i className={!this.state.showPreview ? 'far fa-file-pdf' : 'far fa-window-close'}></i>
          </Button>
          {userCanSave &&
            <Button
              style={styles.button}
              color="link" size="md"
              onClick={this.postCollection}
              onMouseOver={() => this.togglePopup('save to server')}
              onMouseLeave={() => this.togglePopup('')}>
              <i className="far fa-save"></i>
            </Button>}
          <Button
            style={styles.button}
            color="link" size="md"
            onClick={this.toggleDeleteWarning}
            onMouseOver={() => this.togglePopup('delete collection')}
            onMouseLeave={() => this.togglePopup('')}>
            <i className="warn-icon fas fa-trash"></i>
          </Button>

        </div>
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

  // this will set the modal props to warn for a unique name, and toggle the modal
  toggleUniqueWarning() {
    let { modalProps } = this.state;
    modalProps.confirming = false;
    modalProps.confirm = this.toggleAlertModal;
    modalProps.message = 'Each collection must have a unique name! Try adjusting the name.'

    this.setState({
      modalProps
    }, () => {
      this.toggleAlertModal();
    });
  }

  // this will set the modal props to warn for a deleting a collection, and toggle the modal
  toggleDeleteWarning() {
    let { modalProps } = this.state;
    let { isSaved, collection } = this.props;

    modalProps.confirming = true;
    modalProps.confirm = isSaved ? this.deleteFromServer : this.deleteNewCollection;
    modalProps.message = isSaved ? 'Are you sure you want to delete this saved collection?': 'Are you sure you want to delete this new collection?'

    this.setState({
      modalProps
    }, () => {
      this.toggleAlertModal();
    });
  }

  // this will toggle the AlertModal used for each warning / confirmation 
  // modal, using the modal props from state. These are changed by the 
  // different situations that demand a warning / confirmation 
  toggleAlertModal() {
    let { modalProps } = this.state;
    modalProps.isVisible = !modalProps.isVisible;

    this.setState({
      modalProps
    })
  }

  render() {

    // if there is a collection in state, this means changes have been made and the props
    // one copied to state to be edited
    let collection = this.state.collection || this.props.collection;

    return (
      <div className="outline collection" style={styles.content}>

        {/* the warning for signing out / improper signin. the props in state are 
        changed in different scenarios */}
        <AlertModal {...this.state.modalProps} />

        {/* the save icon that appears once we have any edits */}
        {this.state.collection && this.props.isSaved &&
          this.renderSaveOption()
        }

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

        {/* the buttons for save, delete, pdf */}
        {this.renderButtons()}

        <Collapse style={{ width: '100%' }} isOpen={this.state.showContent}>

          <CSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>

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
        </Collapse>
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
    marginLeft: '10px',
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
    fontSize: '16px',
    paddingTop: '0px'
  },
  expandButton: {
    fontSize: '16px',
    position: 'absolute',
    right: '45%',
    bottom: '0px'
  },
  popupText: {
    color: 'white',
    fontSize: '12px',
    padding: '0px',
    margin: '0px 30px'
  }
}

export default Collection;
