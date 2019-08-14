import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, ButtonGroup, Input, Form, InputGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// functions
import { saveCollection } from '../tools/serverFunctions';

// this form is toggled visible by the 'add to collection' button on the search page
class CollectionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      highlightInd: null,
      updating: false,
      creating: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.patchCollection = this.patchCollection.bind(this);
    this.combineAllCollections = this.combineAllCollections.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.renderSelectors = this.renderSelectors.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderArticlePreview = this.renderArticlePreview.bind(this);
  }

  componentDidMount() {
    // if there are no collections in props, 
    // check for localStorage Collections and register them in app
    let noPropsCollections = this.props.collections.length === 0;
    let localCollections = JSON.parse(localStorage.getItem('collections'));

    if (localCollections && localCollections.length > 0 && noPropsCollections) {
      localCollections.forEach((collection) => {
        this.props.createNewCollection(collection, () => {
          console.log(`${collection.name} registered from localStorage`)
        });
      })
    }

  }

  // use this function to combine the user collections(if present) with the props.collections(if present)
  combineAllCollections() {

    let propCollections = JSON.parse(JSON.stringify(this.props.collections));
    // console.log(propCollections)

    let allCollections;
    if (this.props.user) {
      let userCollections = JSON.parse(JSON.stringify(this.props.user.collections)) || [];
      // console.log(userCollections)

      allCollections = propCollections.concat(userCollections);
    } else {
      allCollections = propCollections;
    }

    return allCollections;
  }

  highlight(i) {
    if (this.state.highlightInd !== i) {
      this.setState({ highlightInd: i });
    } else {
      this.setState({ highlightInd: null })
    }
  }

  renderMessage() {
    // console.log(this.props.collections)
    let message;
    if (this.props.collections.length === 0) {
      message = `You don't currently have any new collections ... would you like to make one? You can enter a name below.`;
    } else {
      message = "Select a collection to add the article to, or make a new collection."
    }

    return (
      <p className="thread-text" style={{ color: 'black' }}>
        {message}
      </p>
    )
  }

  renderSelectors() {
    // console.log(this.props.user)

    let allCollections = this.combineAllCollections();

    if (allCollections.length > 0) {

      return (
        <div className="center-all-col">
          {allCollections.map((collection, i) =>
            <Button key={i}
              color="link" className="nav-link"
              style={{ fontSize: '14px', backgroundColor: i === this.state.highlightInd ? '#CADEE8' : 'white' }}
              onClick={() => this.highlight(i)}>{`${collection.name} ( ${collection.articles.length} )`}</Button>)}
        </div>
      )
    } else {
      return null;
    }
  }

  renderInput() {

    return (
      <Form onSubmit={this.handleSubmit}>

        <InputGroup>

          <p style={styles.text}>
            new collection:
            </p>
          <Input style={{ margin: '10px', borderRadius: '25px' }}
            placeholder={" Ex - Cancer Biology "}
            value={this.state.name}
            onChange={(e) => this.handleChange(e.target.value)}
          />
        </InputGroup>

      </Form>
    )
  }

  renderArticlePreview() {
    let title = this.props.article.title;
    let text = [`${title}`, 'will be added to the collection.']
    return (
      <div id="article-preview">
        {text.map((str, i) => {
          return <p key={i} style={i === 0 ? styles.articleText : styles.text}>{str}</p>
        })}
      </div>
    )
  }

  // handleChange changes the value of the input
  handleChange(value) {
    // console.log(value)
    this.setState({
      name: value
    });
  }

  // handleSubmit will fire the submitted data back through Search to App and be recorded
  handleSubmit(e) {
    // console.log('collection input submitted')
    e.preventDefault();

    // if we're updating an existing collection
    if (this.state.highlightInd !== null) {

      let allCollections = this.combineAllCollections();
      let selectedCollection = allCollections[this.state.highlightInd];

      // if it has an owner, its a saved collection
      if (selectedCollection.owner) {
        // send a patch request with the modified collection
        return this.patchCollection(selectedCollection)

      } else {
        // the collection is new, not on the server yet
        // handle it with the modifyCollection function in App
        let collectionName = selectedCollection.name;
        return this.props.modifyCollection(this.props.article, collectionName, 1, () => {
          // console.log('article added to collection')
          this.setState({ name: '' });
        })
      }

    }

    // if we're creating a new collection

    // check there is something there and it isn't just whitespace
    if (!this.state.name || this.state.name.trim().length === 0) {
      this.setState({
        name: ''
      })
      return;
    }

    // otherwise, make a new collection and register it with the function drilled from App
    let collection = {
      name: this.state.name,
      articles: [this.props.article]
    }
    this.props.createNewCollection(collection, () => {
      console.log('collection created!');
      this.setState({ name: '' });
    });

    // reset the highlightInd to prevent empty inputs after submits
    this.setState({
      highlightInd: null
    })

  }

  // this will get fired upon submission, if the user selected a previously saved 
  // collection to add the article to
  patchCollection(collection) {
    collection.articles.push(this.props.article);

    let token = JSON.parse(localStorage.getItem('token'));

    if (!token) {
      return console.log('user is not signed in with a token');
    }

    let headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    // Post the collection to save it to the server. Using the currently stored token
    // will assign the user as the owner of the collection in mongodb on the backend
    return saveCollection(collection, headers, true)
      .then((response) => {
        console.log(response)

        // once we have successfully posted, we will: 

        // 1. Refresh the user's collections - this will send the new collection list sent back
        // from the server to the root App component to update all concerned components
        this.props.refreshUserCollections(response);

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  closeModal() {
    this.props.toggle();
    // set a timeout on the reset here so the content doesn't jump before the modal
    // fades
    setTimeout(() => {
      this.setState({
        highlightInd: null
      })
    }, 1000)
  }

  render() {

    return (
      <Modal centered={true} isOpen={this.props.isVisible} toggle={this.props.toggle}>

        {/* <ModalHeader toggle={this.props.toggle}>Your Collections</ModalHeader> */}
        <ModalBody>
          {this.renderMessage()}

          {/* select an exisiting collection */}
          {this.renderSelectors()}

          {this.renderArticlePreview()}

          {/* name a new one */}
          {this.renderInput()}

        </ModalBody>
        <ModalFooter>
          <Button color="primary" size="sm" onClick={this.handleSubmit}>add article</Button>
          <Button color="secondary" size="sm" onClick={() => this.closeModal()}>close</Button>
        </ModalFooter>

      </Modal>

    );
  }
}

const styles = {
  content: {
    height: '100%',
  },
  text: {
    color: 'black',
    margin: '10px 20px',
    fontSize: '14px'

  },
  articleText: {
    color: 'blue',
    margin: '10px 20px',
    fontWeight: 'bold',
    fontSize: '14px'
  }

}

export default CollectionForm;
