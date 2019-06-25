import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, Input, Form, InputGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// this form is toggled visible by the 'add to collection' button on the search page
class CollectionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  componentDidMount() {
    // 
  }

  renderPdf () {
    
  }

  renderInput() {

    return (
      <Form style={{ marginTop: '25px' }} onSubmit={this.handleSubmit}>

        <p style={styles.text}>
          Please enter an email to address send the collection to.
          </p>

        <InputGroup>

          <Input style={{ borderRadius: '25px' }}
            placeholder={" email address "}
            value={this.state.name}
            onChange={(e) => this.handleChange(e.target.value)}
          />
        </InputGroup>

      </Form>
    )

  }

  // handleChange changes the value of the input
  handleChange(value) {
    // console.log(value)
    this.setState({
      name: value
    });
  }

  // handleSubmit will fire the email
  handleSubmit(e) {
    // console.log('collection input submitted')
    e.preventDefault();

  }

  render() {

    return (
      <Modal centered={true}
        isOpen={this.props.isVisible}
        toggle={this.props.toggle}>

        {/* <ModalHeader toggle={this.props.toggle}>Your Collections</ModalHeader> */}
        <ModalBody>

          {this.renderInput()}

        </ModalBody>
        <ModalFooter>
          <Button color="primary" size="sm" onClick={this.handleSubmit}>send collection</Button>
          <Button color="secondary" size="sm" onClick={this.props.toggle}>close</Button>
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
  },

}

export default CollectionForm;
