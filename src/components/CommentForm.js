import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, Input, Form, InputGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// this form is toggled visible by the 'add to collection' button on the search page
class CommentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: {},
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // 
  }

  // handleChange changes the value of the input
  handleChange(e) {
    let comment = this.state.comment;

    comment.text = e.target.value;
    this.setState({ comment }, () => {
      console.log(this.state.comment)
    })
  }

  // handleSubmit will fire the email
  handleSubmit() {

    if (this.state.comment.text) {
      this.props.confirm(this.state.comment);
    }
    this.props.toggle();
  }

  render() {

    return (
      <div style={{ marginTop: '25px' }}>

        <p style={styles.text}>
          Have something to say about this thread? Add a comment to join the discussion.
        </p>


        <Input style={styles.input}
          type="textarea"
          placeholder={"Your comment here"}
          value={this.state.name}
          onChange={(e) => this.handleChange(e)}
        />

        <div style={styles.buttonHolder}>
          <Button className="add article-button" size="sm"
            onClick={this.handleSubmit}>post comment</Button>
          <Button className="back article-button" 
            onClick={this.props.toggle} size="sm">cancel</Button>
        </div>

      </div>

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
  input: {
    width: '95%',
    margin: '15px auto',
    borderRadius: '6px',
    padding: '8px'
  },
  buttonHolder: {
    alignSelf: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }

}

export default CommentForm;
