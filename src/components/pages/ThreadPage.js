import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import Thread from '../Thread';
import ThreadForm from '../ThreadForm';
import { Button, Fade } from 'reactstrap';

// functions
import { getPublicThreads, saveThread } from '../../tools/serverFunctions';

import Loader from 'react-loader-spinner';


// ******************************************************************************
class ThreadPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      warningMessage: 'Sorry, there was a problem. Please try again.',
      selected: null,
      sorter: '',
      showThreadForm: false,
      showUniqueWarning: false,
      threadPage: 1,
      threadSorter: 'date',
    }

    this.fetchServerThreads = this.fetchServerThreads.bind(this);
    // this.renderLoader = this.renderLoader.bind(this);

    this.renderThreads = this.renderThreads.bind(this);
    this.toggleThreadForm = this.toggleThreadForm.bind(this);
    this.handleSubmitThread = this.handleSubmitThread.bind(this);
    this.toggleUniqueWarning = this.toggleUniqueWarning.bind(this);

    // this is passed to the individual threads. the form is rendered here
    this.handleEdit = this.handleEdit.bind(this);

    // the sorting functionality
    this.renderSorters = this.renderSorters.bind(this);
    this.handleSortButton = this.handleSortButton.bind(this);
    this.sortThreads = this.sortThreads.bind(this);
  }

  componentDidMount() {

    // console.log(!this.props.serverThreads)

    if (!this.props.serverThreads) {
      // console.log('there are no serverThreads in props')
      this.fetchServerThreads();
    }
  }

  // the buttons to sort by date, citations, etc
  renderSorters() {
    let sortButtons = [
      {
        text: 'newest',
        sorter: '_id'
      },
      {
        text: '#of comments',
        sorter: 'commentsCount'
      },
    ];

    return (

      <div className="left-all-row" style={{ padding: '0px 24px' }}>
        <p style={{ fontSize: '12px', padding: '5px' }}>sort by:</p>

        {sortButtons.map((button, i) => {

          let isLocalSorter = JSON.parse(localStorage.getItem('threadSorter')) === button.sorter;

          let color;
          if (isLocalSorter) {
            color = 'blue';
          } else {
            color = 'white';
          }
          return <Button key={i} style={{ color }} className="sort-link" color="link" size="sm"
            onClick={() => this.handleSortButton(button.sorter)}>{button.text}</Button>
        })}
      </div>
    )
  }

  // the sorter is already set to a property of any thread, so we can use
  // it directly below 
  sortThreads() {
    let threads = JSON.parse(JSON.stringify(this.props.serverThreads));
    let { sorter } = this.state;

    threads = threads.sort((a, b) => {
      console.log(a[sorter], b[sorter])
      if (sorter === 'name') {
        return a[sorter] > b[sorter] ? 1 : -1;
      } else {
        return a[sorter] < b[sorter] ? 1 : -1;
      }
    });

    this.props.refreshServerThreads(threads);
  }

  handleSortButton(sorter) {
    // update local storage
    localStorage.setItem('threadSorter', JSON.stringify(sorter))

    // update the state    
    this.setState({
      sorter
    }, () => {
      // sort 'em
      this.sortThreads();

    })
  }

  fetchServerThreads() {
    // console.log('fetching server threads');

    let { threadSorter, threadPage } = this.state;

    // for server requests
    // const user = JSON.parse(localStorage.getItem('user'));
    // const token = JSON.parse(localStorage.getItem('token'));
    const headers = {
      // Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    return getPublicThreads(headers, threadSorter, threadPage)
      .then((response) => {
        // console.log(response)

        // once we have posted, we will register in App. 
        // This is handled separately from patches / posts, because when we fetch the entire list,
        // we can just register that as the serverThreads in App
        this.props.registerServerThreads(response);

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  // for when the threads are being fetched
  renderLoader() {
    return (
      <div style={styles.loaderHolder} id="loader" key="loader">
        <p className="thread-text">getting threads ... </p>
        <Loader
          height={100}
          width={100}
          type="ThreeDots"
          color="whitesmoke"
        />
      </div>
    )
  }

  // we use the isUsers flag to determine if this is the user's thread or not
  // this will allow the user to edit their own thread info, but not others (its also restricted on the backend)
  // comments are public, so any user can comment on any thread. 
  // nly thread info - name, article, paragraph - is restricted
  renderThreads(threads, isUsers) {
    let title = isUsers ? 'your threads' : 'recent threads';

    // for the server threads, filter out the user's own threads if the user
    // is logged in - we can already access them in the user section
    if (!isUsers && this.props.user) {
      threads = threads.filter(thread => thread.owner !== this.props.user._id)
    }
    return (
      <div className="center-all-col" style={{paddingBottom: '20px'}}>

        <p className="section-title">{title}</p>

        {!isUsers && this.renderSorters()}

        {threads.map((thread, i) => {
          return <Thread key={i}
            user={this.props.user}
            allowEdit={isUsers}
            handleEdit={this.handleEdit}
            thread={thread}
            handleSubmitThread={this.handleSubmitThread}
            refreshServerThreads={this.props.refreshServerThreads}
            deleteThread={this.props.deleteThread}
            toggleThreadForm={this.toggleThreadForm}
          />
        })}
      </div>
    )
  }

  toggleUniqueWarning(str) {
    this.setState({
      warningMessage: str,
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

  // this function will set the thread that was clicked on as the selected thread 
  // in state, then toggle the form
  handleEdit(thread) {
    // console.log(thread)
    let selected = thread ? thread : null;
    this.setState({
      selected
    }, () => {
      this.toggleThreadForm();
    })
  }

  toggleThreadForm() {

    this.setState({
      showThreadForm: !this.state.showThreadForm
    }, () => {
      if (!this.state.showThreadForm) {
        this.setState({
          selected: null
        })
      }
    })
  }

  // this will post our thread and relay the response back to App
  handleSubmitThread(threadInfo) {
    // console.log(threadInfo)

    // get local storage info
    const user = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    // we need to know if its one of the logged in user's threads. this will control
    // whether we need to update the user's threads or not
    let isUsers = threadInfo.owner === user._id;

    // need to know if its a new thread. If it is, it won't have an owner
    let isNewThread = !threadInfo.owner;

    // If the thread is tagged with the isComment property, it came from the CommentForm
    let isComment = threadInfo.isComment;

    // must be logged in
    if (!user || !token) {
      return;
    }

    if (!threadInfo || Object.keys(threadInfo).length === 0) {
      return;
    }
    // console.log('posting thread')

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
    // console.log(isUsers)
    return saveThread(post, headers, isComment, isUsers)
      .then((response) => {
        // console.log(response)

        if (response.code === 11000) {
          return this.toggleUniqueWarning('Names must be unique!');
        }

        if (response.errors) {
          return this.toggleUniqueWarning('There was a problem submitting your thread. Make sure to fill out all fields!');
        }

        // once we have posted, we will: 
        // Success => refresh the threads. This will relay the new thread sent back
        // from the server to the root App component to update all concerned components

        // refresh for the user if this was a user thread, or a new thread
        if (isUsers || isNewThread) {
          this.props.refreshUserThreads(response);
        }

        // and always refresh the server threads
        this.props.refreshServerThreads(response);


        // take down the form if it is up - this is only for new threads, or patching 
        // thread info (not comments)
        if (this.state.showThreadForm) {
          this.toggleThreadForm();
        }

        // once we submit, clear the selected thread
        this.setState({
          selected: null
        })

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

    const headerSubtitle = this.props.user ? "post a thread to start a discussion" : "login and post a thread to start a discussion";
    const threadHeaderText = this.state.selected ? "" : "Start a discussion with other researchers";
    return (
      <div className="page">

        <ThreadForm
          headerText={threadHeaderText}
          user={this.props.user}
          thread={this.state.selected}
          toggle={this.toggleThreadForm}
          isVisible={this.state.showThreadForm}
          handleSubmitThread={this.handleSubmitThread}
          toggleUniqueWarning={this.toggleUniqueWarning}
          showUniqueWarning={this.state.showUniqueWarning}
          warningMessage={this.state.warningMessage}
        />

        <div className="glass page-content" >


          {/* the header */}
          <Header
            class="heading"
            title={"PMC Threads"}
            subtitle={headerSubtitle}
          />

          <div className="outline" style={styles.threadsHolder}>
            {/* the button for new threads - only present when logged in */}
            <Fade in={!!this.props.user} style={styles.buttonHolder}>
              <Button className="add article-button" size="sm"
                onClick={() => this.handleEdit()}>+new thread</Button>
            </Fade>

            {/* the loader icon */}
            {!haveServerThreads &&
              this.renderLoader()
            }

            {haveUserThreads && this.renderThreads(user.threads, true)}

            {haveServerThreads && this.renderThreads(serverThreads)}


          </div>


        </div>

      </div>
    );
  }
}

const styles = {
  buttonHolder: {
    position: 'absolute',
    top: '18px',
    right: '30px',
    display: 'flex',
    flexDirection: 'row'
  },
  threadsHolder: {
    position: 'relative',
    // width: '100%'
  }
}

export default ThreadPage;
