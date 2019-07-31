import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import Thread from '../Thread';
import ThreadForm from '../ThreadForm';
import { Button } from 'reactstrap';

// functions
import { saveThread } from '../../tools/serverFunctions';

// ******************************************************************************
class ThreadPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showThreadForm: false
    }

    this.renderThreads = this.renderThreads.bind(this);
    this.toggleThreadForm = this.toggleThreadForm.bind(this);
    this.handleSubmitThread = this.handleSubmitThread.bind(this);
  }

  renderThreads() {
    let threads = this.props.threads;

    return threads.map((thread, i) => {
      return <Thread key={i} thread={thread} />
    })
  }

  toggleThreadForm() {

    // set the selected thread if we are about to show the modal
    if (!this.state.showThreadForm) {

    }

    this.setState({
      showThreadForm: !this.state.showThreadForm
    }, () => {
      console.log(this.state.showThreadForm)
    })
  }

  // this will post our thread and relay the response back to App
  handleSubmitThread(threadInfo) {

    let user = JSON.parse(localStorage.getItem('user'));
    let token = JSON.parse(localStorage.getItem('token'));

    // must be logged in
    if (!user || !token) {
      return;
    }

    if (!threadInfo || Object.keys(threadInfo).length === 0) {
      return;
    }
    console.log('posting thread')

    // set up post obj with user
    let post = {
      user: user.name || user.email
    };

    // Add all the non-empty entries
    Object.keys(threadInfo).forEach((key) => {
      if (threadInfo[key]) {
        post[key] = threadInfo[key]
      }
    })

    let headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    // Post the thread to the server. Using the currently stored token
    // will assign the user as the owner of the thread in mongodb on the backend.

    // If the thread has an owner already, that means its been posted before => its a patch
    // this is handled inside saveThread() with the isExisiting boolean
    let isExisting = !!post._id;

    console.log(post)
    return saveThread(post, headers, isExisting)
      .then((response) => {
        console.log(response)

        // once we have successfully posted, we will: 

        // 1. Refresh the threads - this will send the new thread list sent back
        // from the server to the root App component to update all concerned components
        response.createdAt && this.props.refreshUserThreads(response);

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  render() {

    return (
      <div className="page">

        <ThreadForm
          toggle={this.toggleThreadForm}
          isVisible={this.state.showThreadForm}
          handleSubmitThread={this.handleSubmitThread}
        />

        <div className="glass page-content" >

          {/* the header */}
          <Header
            class="heading"
            title={"PMC Threads"}
            subtitle={"post a thread to start a discussion"}
          />

          {/* make a new thread */}
          <Button color="primary" style={styles.button}
            onClick={this.toggleThreadForm}>start a new thread</Button>

          {this.props.threads.length > 0 && this.renderThreads()}

        </div>

      </div>
    );
  }
}

const styles = {
  button: {
    margin: '20px',
    alignSelf: 'flex-start'
  }
}

export default ThreadPage;
