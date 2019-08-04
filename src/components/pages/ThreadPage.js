import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import Thread from '../Thread';
import ThreadForm from '../ThreadForm';
import { Button } from 'reactstrap';

// functions
import { getPublicThreads, saveThread } from '../../tools/serverFunctions';

// for server requests
const user = JSON.parse(localStorage.getItem('user'));
const token = JSON.parse(localStorage.getItem('token'));
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

// ******************************************************************************
class ThreadPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sorter: '',
      showThreadForm: false,
      showUniqueWarning: false,
      threadPage: 1,
      threadSorter: 'date'
    }

    this.fetchServerThreads = this.fetchServerThreads.bind(this);
    this.renderThreads = this.renderThreads.bind(this);
    this.toggleThreadForm = this.toggleThreadForm.bind(this);
    this.handleSubmitThread = this.handleSubmitThread.bind(this);
    this.toggleUniqueWarning = this.toggleUniqueWarning.bind(this);
  }

  componentDidMount() {

    console.log(!this.props.serverThreads)

    if (!this.props.serverThreads) {
      console.log('there are no serverThreads in props')
      this.fetchServerThreads();
    }
  }

  fetchServerThreads() {
    console.log('fetching server threads');

    let { threadSorter, threadPage } = this.state;

    return getPublicThreads(headers, threadSorter, threadPage)
      .then((response) => {
        console.log(response)

        // once we have posted, we will refresh in App
        this.props.refreshServerThreads(response)


        // Fail => show the fail message / reason

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  // we use the isUsers flag to determine if this is the user's thread or not
  // this will allow the user to edit their own thread info, but not others (its also restricted on the backend)
  // comments are public, so any user can comment on any thread. 
  // nly thread info - name, article, paragraph - is restricted
  renderThreads(threads, isUsers) {
    let title = isUsers ? 'your threads' : 'recent threads';
    return (
      <div className="center-all-col">
        <p className="section-title">{title}</p>
        {threads.map((thread, i) => {
          return <Thread key={i}
            allowEdit={isUsers}
            thread={thread}
            handleSubmitThread={this.handleSubmitThread} 
            refreshServerThreads={this.props.refreshServerThreads}
            />
        })}
      </div>
    )
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

    // we need to know if its one of the logged in user's threads. this will control
    // whether we need to update the user's threads or not
    let isUsers = threadInfo.owner === user._id; 

    // need to know if its a new thread. If it is, it won't have an owner
    let isNewThread = !!threadInfo.owner;

    // If the thread is tagged with the isComment property, it came from the CommentForm
    let isComment = threadInfo.isComment;

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

    if (!threadInfo.isComment) {
      // Add all the non-empty entries
      Object.keys(threadInfo).forEach((key) => {
        if (threadInfo[key]) {
          post[key] = threadInfo[key]
        }
      })
    } else {
      // this means we are just posting a comment straight from the Comment Form,
      // we don't need to change it
      post = threadInfo;
    }

    // Post the thread to the server. Using the currently stored token
    // will assign the user as the owner of the thread in mongodb on the backend.
    console.log(post)
    return saveThread(post, headers, isComment)
      .then((response) => {
        console.log(response)

        // once we have posted, we will: 

        // Success => refresh the threads. This will send the new thread list sent back
        // from the server to the root App component to update all concerned components
        if (response.code !== 11000) {
          this.props.refreshServerThreads(response);

          // refresh for the user if this was a user thread, or a new thread
          if (isUsers || isNewThread) {
            this.props.refreshUserThreads(response);
          }

          if (this.state.showThreadForm) {
            this.toggleThreadForm();
          }
        } else {
          this.toggleUniqueWarning()
        }

        // Fail => show the fail message / reason

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  render() {

    const { user, serverThreads } = this.props;
    const haveUserThreads = user && user.threads && user.threads.length > 0;
    const haveServerThreads = serverThreads && serverThreads.length > 0;

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

          {haveServerThreads && this.renderThreads(serverThreads)}

          {haveUserThreads && this.renderThreads(user.threads, true)}

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
