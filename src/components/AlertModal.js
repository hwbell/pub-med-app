import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, Input, Form, InputGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// this form is toggled visible by the 'add to collection' button on the search page
class AlertModal extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // setTimeout()
  }

  render() {

    return (
      <Modal centered={true}
        isOpen={this.props.isVisible}
        toggle={this.props.toggle}>

        {/* <ModalHeader toggle={this.props.toggle}>Your Collections</ModalHeader> */}
        <ModalBody>

          <p style={styles.articleText}>{this.props.message}</p>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" size="sm" onClick={this.props.confirm}>OK</Button>
          {this.props.confirming &&
            <Button color="secondary" size="sm" onClick={this.props.toggle}>cancel</Button>
          }
        </ModalFooter>

      </Modal>

    );
  }
}

const styles = {
  content: {
    height: '100%',
  },
  articleText: {
    color: 'black',
    margin: '10px 20px',
    fontSize: '18px'
  },

}

export default AlertModal;
