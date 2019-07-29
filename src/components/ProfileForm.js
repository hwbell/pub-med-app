import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form } from 'reactstrap';

// ******************************************************************************
class ProfileForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileInfo: {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {

    let { name, value } = e.target;

    // use the target name as the key for the value in profileInfo
    let obj = this.state.profileInfo;
    obj[`${name}`] = value;

    this.setState({ profileInfo: obj }, () => {
      // console.log(this.state.user)
    })
  }

  handleSubmit() {
    this.props.handleSubmitUser(this.state.profileInfo);

    // wipe the state - we only need it before it is sent to the server
    // this.setState({
    // profileInfo: {}
    // })
  }

  render() {

    return (
      <Modal centered={true}
        isOpen={this.props.isVisible}
        toggle={this.props.toggle}>

        <ModalHeader>Add some info to your profile</ModalHeader>
        <ModalBody>

          <Form style={styles.form} onSubmit={this.handleSubmit}>

            <p style={{ color: 'black' }}>About</p>
            <Input style={styles.inputLarge} type="textarea" name="about"
              maxLength={200}
              placeholder="Say something about yourself!"
              onChange={(e) => this.handleChange(e)}
            />

            <p style={{ color: 'black' }}>Research</p>
            <Input style={styles.input} type="text" name="research"
              maxLength={50}
              placeholder="What is your area of expertise?"
              onChange={(e) => this.handleChange(e)}
            />

            <p style={{ color: 'black' }}>Affiliations</p>
            <Input style={styles.input} type="text" name="affiliations"
              maxLength={50}
              placeholder="Where do you conduct your research?"
              onChange={(e) => this.handleChange(e)}
            />

            <p style={{ color: 'black' }}>Interests</p>
            <Input style={styles.input} type="text" name="interests"
              maxLength={50}
              placeholder="What are your interests outside of research?"
              onChange={(e) => this.handleChange(e)}
            />

          </Form>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" size="sm" onClick={this.handleSubmit}>save</Button>
          <Button color="secondary" size="sm" onClick={this.props.toggle}>cancel</Button>
        </ModalFooter>

      </Modal>
    );
  }
}

const styles = {
  input: {
    marginBottom: '20px',
    textAlign: 'left'
  },
  inputLarge: {
    marginBottom: '20px',
    height: '140px',
    textAlign: 'left',
    paddingTop: 0
  }
}

export default ProfileForm;
