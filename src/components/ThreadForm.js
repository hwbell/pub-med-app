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
      threadUpdates: {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
  }

  handleChange(e) {

    let { name, value } = e.target;

    // use the target name as the key for the value in profileInfo
    let obj = this.state.threadUpdates;
    obj[`${name}`] = value;

    this.setState({ threadUpdates: obj }, () => {
      // console.log(this.state.user)
    })
  }

  handleSubmit() {
    this.props.handleSubmitThread(this.state.threadUpdates);

    // wipe the state - we only need it before it is sent to the server
    this.setState({
      threadUpdates: {}
    })
  }

  renderInputs() {
    // set the current value of the inputs from this.state.profileInfo, if available.
    // this means we have changed something 
    let thread = this.props.thread;
    let threadUpdates = this.state.threadUpdates;

    let threadProps = ['name', 'article', 'paragraph', 'comment'];
    let placeholders = {
      name: 'Give your post a clear, searchable name!',
      article: 'Include the PMID or PMCID of related articles.',
      // user: '',
      paragraph: 'Give a short description of the topic of your thread.',
      comment: 'Add a comment to your thread'
    }

    let threadInfo = {};

    threadProps.forEach((prop) => {

      if (threadUpdates[prop]) {
        threadInfo[prop] = threadUpdates[prop];
      } else if (thread && thread[prop]) {
        threadInfo[prop] = thread[prop];
      } else {
        threadInfo[prop] = ''
      }

    })

    return Object.keys(threadInfo).map((name, i) => {
      console.log(placeholders[name])

      console.log(i, name)

      let title = name[0].toUpperCase() + name.slice(1);

      let type = 'text';
      let style = styles.input;
      if (name === 'paragraph' || name === 'comment') {
        type = 'textarea';
        style = styles.inputLarge;
      }

      return (
        <div key={i}>
          <p style={{ color: 'black' }}>{title}</p>
          <Input style={style} type={type} name={name}
            maxLength={500}
            value={threadInfo[name] || ''}
            placeholder={placeholders[name]}
            onChange={(e) => this.handleChange(e)}
          />
        </div>
      )

    })
  }

  render() {

    // set the current value of the inputs from this.state.profileInfo, if available.
    // this means we have changed something 

    return (
      <Modal centered={true}
        isOpen={this.props.isVisible}
        toggle={this.props.toggle}>

        <ModalHeader>Add some info to your profile</ModalHeader>
        <ModalBody>

          <Form style={styles.form} onSubmit={this.handleSubmit}>

            {this.renderInputs()}

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
