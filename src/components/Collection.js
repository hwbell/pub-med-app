import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';
import ArticleResult from './ArticleResult';
import { PDFViewer } from '@react-pdf/renderer';
import GeneratedPdf from './GeneratedPdf';

// tools
import { saveCollection } from '../tools/serverFunctions';
import { CSSTransitionGroup } from 'react-transition-group' // ES6

// ******************************************************************************
class Collection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      showPreview: false
    }

    this.togglePreview = this.togglePreview.bind(this);
    this.postCollection = this.postCollection.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing
    });
  }

  togglePreview() {
    this.setState({
      showPreview: !this.state.showPreview
    })
  }

  postCollection() {
    console.log(`posting ${this.props.collection.name} to server`)
    let token = JSON.parse(localStorage.getItem('token'));
    let headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    // Post the collection to save it to the server. Using the currently stored token
    // will assign the user as the owner of the collection in mongodb on the backend
    return saveCollection(this.props.collection, headers)
      .then((response) => {
        console.log(response)

        // once we have successfully posted, we will: 

        // 1. Refresh the userCollections - this will send the new collection list sent back
        // from the server to the root App component to update all concerned components
        this.props.refreshUserCollections(response);

        // 2. Remove this collection from the 'New Collections' list 
        this.props.handleDelete(this.props.collection);

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
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

  render() {
    let collection = this.props.collection;

    return (
      <div className="outline collection" style={styles.content}>
        <div className="row" style={styles.titleHolder}>

          <div className="row">
            <p className="collection-title">
              <strong>{`${collection.name} `}</strong>
            </p>
            <i className="far fa-edit" style={styles.icon}
              onClick={this.toggleEdit}></i>
            <p className="collection-title">
              {`${collection.articles.lenth}`}
            </p>
          </div>

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
  buttonHolder: {
    padding: '10px'
  },
  icon: {
    marginTop: '14px',
    fontSize: '14px',
  }
}

export default Collection;
