import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, ButtonGroup, Input, Form, InputGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


// this form is toggled visible by the 'add to collection' button on the search page
class CollectionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      highlightInd: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.renderSelectors = this.renderSelectors.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderArticlePreview = this.renderArticlePreview.bind(this);
  }

  componentDidMount() {
    // 
  }

  highlight(i) {
    if (this.state.highlightInd !== i) {
      this.setState({highlightInd: i});
    } else {
      this.setState({highlightInd: null})
    }
  }
  renderSelectors() {

    if (this.props.collections.length > 0) {

      return (
        <div className="center-all-col">
          {this.props.collections.map((collection, i) => 
            <Button key={i} 
              color="link" className="nav-link"
              style={{backgroundColor: i === this.state.highlightInd ? 'whitesmoke': 'white'}}
              onClick={() => this.highlight(i)}>{collection.name}</Button> )}
        </div>
      )
    } else {
      return null;
    }
  }

  renderMessage() {
    console.log(this.props.collections)
    let message;
    if (this.props.collections.length === 0) {
      message = "You don't currently have any collections ... would you like to make one?";
    } else {
      message = "Select a collection to add the article to, or make a new collection."
    }

    return (
      <p className="article-title" style={{ color: 'black' }}>
        {message}
      </p>
    )
  }

  renderInput() {

    if (this.state.highlightInd === null) {
      return (
        <Form style={{ marginTop: '25px' }} onSubmit={this.handleSubmit}>
  
          <InputGroup>
  
            <p style={styles.text}>
              new collection:
            </p>
            <Input style={{ borderRadius: '25px' }}
              placeholder={" Ex - Cancer Biology "}
              onChange={(e) => this.handleChange(e.target.value)}
            />
          </InputGroup>
  
        </Form>
      )
    } else {
      return null;
    }

  }

  renderArticlePreview() {
    let title = this.props.article.title;
    let text = [`${title}`, 'will be added to the collection.']
    return (
      <div>
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
    console.log('collection input submitted')
    e.preventDefault();

    // if we're updating an existing collection
    if (this.state.highlightInd !== null) {
      let collectionName = this.props.collections[this.state.highlightInd].name;
      return this.props.modifyCollection(this.props.article, collectionName, 1, () => {
        console.log('article added to collection')
      })
    }

    // if we're creating a new collection
    let name = this.state.name;
    if (name.length === 0) {
      return;
    }

    // we make a new collection and register it with the function drilled from App
    let collection = {
      name,
      articles: [this.props.article]
    }
    this.props.createNewCollection(collection, () => {
      console.log('collection created!')
    });

  }

  render() {

    return (
      <Modal isOpen={this.props.isVisible} toggle={this.props.toggle}>

        {/* <ModalHeader toggle={this.props.toggle}>Your Collections</ModalHeader> */}
        <ModalBody>
          {this.renderMessage()}

          {this.renderSelectors()}

          {this.renderArticlePreview()}

          {/* select an exisiting collection */}

          {/* name a new one */}
          {this.renderInput()}

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleSubmit}>create collection</Button>{' '}
          <Button color="secondary" onClick={this.props.toggle}>cancel</Button>
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
    margin: '5px 20px'
  },
  articleText: {
    color: 'blue',
    margin: '10px 20px',
    fontWeight: 'bold',
    fontSize: '18px'
  }

}

export default CollectionForm;
