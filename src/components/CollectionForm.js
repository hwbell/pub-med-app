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
      name: '',
      highlightInd: null,
      updating: false,
      creating: false
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
      this.setState({ highlightInd: i });
    } else {
      this.setState({ highlightInd: null })
    }
  }

  renderMessage() {
    console.log(this.props.collections)
    let message;
    if (this.props.collections.length === 0) {
      message = `You don't currently have any collections ... would you like to make one?
      You can enter a name below.`;
    } else {
      message = "Select a collection to add the article to, or make a new collection."
    }

    return (
      <p className="article-title" style={{ color: 'black' }}>
        {message}
      </p>
    )
  }

  renderSelectors() {

    if (this.props.collections.length > 0) {

      return (
        <div className="center-all-col">
          {this.props.collections.map((collection, i) =>
            <Button key={i}
              color="link" className="nav-link"
              style={{ backgroundColor: i === this.state.highlightInd ? 'whitesmoke' : 'white' }}
              onClick={() => this.highlight(i)}>{`${collection.name} ( ${collection.articles.length} )`}</Button>)}
        </div>
      )
    } else {
      return null;
    }
  }

  renderInput() {

    if (this.state.highlightInd === null) {
      return (
        <Form onSubmit={this.handleSubmit}>

          <InputGroup>

            <p style={styles.text}>
              new collection:
            </p>
            <Input style={{ borderRadius: '25px' }}
              placeholder={" Ex - Cancer Biology "}
              value={this.state.name}
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
      let collectionName = this.props.collections[this.state.highlightInd].name;
      return this.props.modifyCollection(this.props.article, collectionName, 1, () => {
        console.log('article added to collection')
        this.setState({name: ''});
      })
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
      this.setState({name: ''});
    });

    // reset the highlightInd to prevent empty inputs after submits
    this.setState({
      highlightInd: null
    })

  }

  closeModal() {
    this.setState({
      highlightInd: null
    }, () => {
      this.props.toggle();
    })
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
    margin: '18px 20px'
  },
  articleText: {
    color: 'blue',
    margin: '10px 20px',
    fontWeight: 'bold',
    fontSize: '18px'
  }

}

export default CollectionForm;
