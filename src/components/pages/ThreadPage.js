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
      showThreadForm: false,
      showUniqueWarning: false
    }

    this.renderThreads = this.renderThreads.bind(this);
    this.toggleThreadForm = this.toggleThreadForm.bind(this);
    this.handleSubmitThread = this.handleSubmitThread.bind(this);
    this.toggleUniqueWarning = this.toggleUniqueWarning.bind(this);
  }

  renderThreads() {
    let threads = this.props.user.threads;

    return threads.map((thread, i) => {
      return <Thread key={i} thread={thread} />
    })
  }

  toggleUniqueWarning() {
    this.setState({
      showUniqueWarning: !this.state.showUniqueWarning
    }, () => {

      // if its now set to true, change it back after 2.4 s
      if (this.state.showUniqueWarning) {
        setTimeout(() => {
          this.setState({
            showUniqueWarning: false
          })
        }, 2400)
      }
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

        // once we have posted, we will: 

        // Success => refresh the threads. This will send the new thread list sent back
        // from the server to the root App component to update all concerned components
        response.createdAt && this.props.refreshUserThreads(response);

        // Fail => show the fail message / reason
        response.code = 11000 && this.toggleUniqueWarning();

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  render() {

    const user = this.props.user;
    const userThreads = user && user.threads && user.threads.length > 0;
    console.log(user)

    return (
      <div className="page">

        <ThreadForm
          toggle={this.toggleThreadForm}
          isVisible={this.state.showThreadForm}
          handleSubmitThread={this.handleSubmitThread}
          showUniqueWarning={this.state.showUniqueWarning}
          toggleUniqueWarning={this.toggleUniqueWarning}
        />

        <div className="glass page-content" >

          {/* the header */}
          <Header
            class="heading"
            title={"PMC Threads"}
            subtitle={"post a thread to start a discussion"}
          />

          {/* make a new thread */}
          <Button className="add article-button" siz="md" style={styles.button}
            onClick={this.toggleThreadForm}>start a new thread</Button>

          {userThreads && this.renderThreads()}

        </div>

      </div>
    );
  }
}

const styles = {
  button: {
    margin: '24px',
    // alignSelf: 'flex-start'
  }
}

export default ThreadPage;
