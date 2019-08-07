import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form, Fade } from 'reactstrap';

// functions
import { combineObjects } from '../tools/objectFunctions'

// ******************************************************************************
class ThreadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      threadInfo: {},
      isNewThread: this.props.thread ? false : true
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
  }

  handleChange(e) {

    let { name, value } = e.target;

    // use the target name as the key for the value in profileInfo
    let obj = this.state.threadInfo;
    obj[`${name}`] = value;

    this.setState({ threadInfo: obj }, () => {
      // console.log(this.state.user)
    })
  }

  handleSubmit() {

    // just check if there are any keys in this.state.threadInfo to see if 
    // anything has actually been typed
    let isUpdated = !!Object.keys(this.state.threadInfo).length

    // this means the user changed something - it now makes sense to submit
    if (isUpdated) {

      // if there isn't a thread in props, this thread is new. just send it off!
      if (!this.props.thread) {
        return this.props.handleSubmitThread(this.state.threadInfo)
      }

      let thread = this.props.thread || {};
      console.log(thread)
      let threadUpdates = this.state.threadInfo;

      // combine the two for the properties available, giving priprity to updates
      let props = Object.keys(thread);
      // console.log(props)
      // console.log(threadUpdates)

      let combined = combineObjects(threadUpdates, thread, props);
      combined.owner = this.props.user._id;

      this.props.handleSubmitThread(combined);
    }
  }

  renderInputs() {
    // set the current value of the inputs from this.state.threadUpdates, if available.
    // this means we have changed something 
    // otherwise get them from props, or just set an empty string
    let thread = this.props.thread;
    let threadUpdates = this.state.threadInfo;

    let threadProps = ['name', 'article', 'paragraph'];

    let placeholders = {
      name: 'Give your post a clear, searchable name!',
      article: 'Include the PMID or PMCID of related articles.',
      paragraph: 'Give a short description of the topic of your thread.',
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

      let title = name[0].toUpperCase() + name.slice(1);
      if (title === 'Name' || title === 'Paragraph') {
        title += ` *`
      }

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

    return (
      <Modal centered={true}
        isOpen={this.props.isVisible}
        toggle={this.props.toggle}>

        <ModalHeader>Start a discussion with other researchers</ModalHeader>
        <ModalBody>

          <Form style={styles.form} onSubmit={this.handleSubmit}>

            {this.renderInputs()}

          </Form>

        </ModalBody>
        <ModalFooter >

          <div >
            <Fade style={{ color: 'red' }} in={this.props.showUniqueWarning}>
              Names must be unique!
            </Fade>
          </div>
          <div>
            <Button className="add article-button" size="sm" onClick={this.handleSubmit}>save</Button>
            <Button className="back article-button" size="sm" onClick={this.props.toggle}>cancel</Button>
          </div>
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

export default ThreadForm;
