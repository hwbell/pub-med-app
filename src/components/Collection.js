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
import { saveCollection } from '../tools/serverFunctions';
import { CSSTransitionGroup } from 'react-transition-group' // ES6

// ******************************************************************************
class Collection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputText: '',
      editing: false,
      showPreview: false
    }

    this.togglePreview = this.togglePreview.bind(this);
    this.postCollection = this.postCollection.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.alertUniqueName = this.alertUniqueName.bind(this);
    this.toggleUniqueWarning = this.toggleUniqueWarning.bind(this);
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

    this.setState({
      collectionEdits: {
        _id: this.props.collection._id,
        name: this.state.inputText
      }
    }, () => {
      this.toggleEdit();
      console.log(this.state.collectionEdits)
    })
    
  }

  postCollection() {
    
    // if this.state.collectionEdits exists, we will send it to the server as a patch
    // otherwise it is treated as a newly posted collection in the saveCollection function
    let collection = this.state.collectionEdits || this.props.collection;
    
    let token = JSON.parse(localStorage.getItem('token'));

    let headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    let isExisting = !!this.state.collectionEdits;

    // Post the collection to save it to the server. Using the currently stored token
    // will assign the user as the owner of the collection in mongodb on the backend
    return saveCollection(collection, headers, isExisting)
      .then((response) => {
        console.log(response)

        // this will be the response for non-unique names
        if (response.code === 11000) {
          return this.alertUniqueName();
        }

        // once we have successfully posted, we will: 

        // 1. Refresh the userCollections - this will send the new collection list sent back
        // from the server to the root App component to update all concerned components
        this.props.refreshUserCollections(response);

        // 2. Remove this collection from the 'New Collections' list, if that's where it came from 
        isExisting && this.props.handleDelete(this.props.collection);

        this.setState({
          collectionEdits: null
        })

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  alertUniqueName() {
    this.toggleUniqueWarning();
  }

  toggleUniqueWarning() {
    this.setState({
      uniqueWarning: !this.state.uniqueWarning
    })
  }

  renderResults(collection) {

    const collectionButtons = [
      {
        text: 'view article',
        onClick: this.props.viewArticle
      },
      {
        text: 'remove',
        onClick: this.props.handleSubmit
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

    let collection = this.props.collection;
    let title = this.state.collectionEdits ? this.state.collectionEdits.name: collection.name;
    
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
    let collection = this.props.collection;
    return (
      <div style={styles.title}>
        <Form onSubmit={this.handleSubmit}>
          <div style={styles.titleHolder}>
            <Input type="text" name="text" id="exampleEmail" className="collection-edit" 
              placeholder={ this.state.tempTitle || collection.name}
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

  renderSaveOption() {
    return (
      <i className="far fa-save" style={styles.icon}
        onClick={this.postCollection}></i>
    )
  }

  render() {
    let collection = this.props.collection;

    return (
      <div className="outline collection" style={styles.content}>

        {/* the save icon that appears once we have any edits */}
        {this.state.collectionEdits && 
          this.renderSaveOption()
        }

        {/* the modal to alert for non-unique properties */}
        <AlertModal 
          message={'Each collection must have a unique name! Try adjusting the name.'}
          isVisible={this.state.uniqueWarning}
          toggle={this.toggleUniqueWarning}
        />

        {/* User can toggle here to edit the title of a collection */}
        <CSSTransitionGroup
            style={styles.titleHolder}
            transitionName="replace"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>

            
            {!this.state.editing &&
              this.renderTitle()}
            {this.state.editing &&
              this.renderInput()}

          </CSSTransitionGroup>
        <div className="" style={styles.titleRow}>

          

          {/* preview / download options for the article */}
          <div style={styles.buttonHolder}>
            <Button
              className="add article-button" size="sm"
              onClick={this.togglePreview}>
              {!this.state.showPreview ? 'make pdf' : 'hide pdf'}
            </Button>
            {!this.props.isSaved &&
              <Button
                className="add article-button" size="sm"
                onClick={this.postCollection}>
                save to my collections
            </Button>}
            <Button
              className="warn article-button" size="sm"
              onClick={() => this.props.handleDelete(collection)}>
              delete
            </Button>

          </div>
        </div>

        <CSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>

          {this.state.showPreview &&
            <div ref={this.props.ref} key="pdf" className="pdf-holder">
              <PDFViewer className="pdf-viewer">
                <GeneratedPdf collection={collection} />
              </PDFViewer>
            </div>}

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
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleHolder: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonHolder: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    position: 'absolute',
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    position: 'absolute',
    right: '20px',
    padding: '10px',
    fontSize: '20px'
  }
}

export default Collection;
