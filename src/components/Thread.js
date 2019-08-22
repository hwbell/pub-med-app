import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Comment from './Comment';
import { Button, Fade, Collapse } from 'reactstrap';
import CommentForm from './CommentForm';
import AlertModal from './AlertModal';

// enter / exit transitions
import { CSSTransitionGroup } from 'react-transition-group' // ES6

// functions
import { deleteThread } from '../tools/serverFunctions';
import { extractStringDate } from '../tools/objectFunctions';

// ******************************************************************************
class Thread extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCommentForm: false,
      showDeleteWarning: false,
      showContent: false
    }

    this.renderThread = this.renderThread.bind(this);
    this.toggleContent = this.toggleContent.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.toggleCommentForm = this.toggleCommentForm.bind(this);
    this.renderCommentForm = this.renderCommentForm.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.toggleDeleteWarning = this.toggleDeleteWarning.bind(this);
    this.handleDeleteThread = this.handleDeleteThread.bind(this);
  }

  toggleContent() {
    this.setState({
      showContent: !this.state.showContent
    }, () => {
      console.log(this.state.showContent)
    })
  }

  toggleCommentForm() {
    this.setState({
      showCommentForm: !this.state.showCommentForm
    })
  }

  toggleDeleteWarning() {
    console.log('toggling delete warning!')
    this.setState({
      showDeleteWarning: !this.state.showDeleteWarning
    })
  }

  handleDeleteThread() {

    // for server requests
    const token = localStorage.getItem('token') !== "undefined" ? JSON.parse(localStorage.getItem('token')) : null;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    return deleteThread(headers, this.props.thread)
      .then((response) => {
        console.log(response)

        // once we have posted, we will refresh in App
        this.props.deleteThread(this.props.thread);

        if (this.state.showDeleteWarning) {
          this.toggleDeleteWarning();
        }

        // Fail => show the fail message / reason

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  renderCommentForm() {
    return (
      <Collapse isOpen={this.state.showCommentForm}>
        <CommentForm toggle={this.toggleCommentForm} confirm={this.submitComment} />
      </Collapse>
    )
  }

  submitComment(comment) {
    // console.log(comment)
    // console.log(`submitting ${comment.user.name}'s comment to ${this.props.thread.name} thread:
    // ${comment.text}`)

    comment._id = this.props.thread._id;
    comment.owner = this.props.thread.owner;
    this.props.handleSubmitThread(comment);
  }

  renderThread() {

    let thread = JSON.parse(JSON.stringify(this.props.thread));

    let createdAt = new Date(thread.createdAt)
    let time = extractStringDate(createdAt);

    return (
      <div style={styles.threadContainer} className="thread">

        <div className="space-all-row">
          <p className="thread-title" style={styles.title}>{thread.name}</p>
          {/* these will show if the user owns the thread */}
          {this.props.allowEdit &&
            <div style={styles.buttonHolder}>
              <i className="fas fa-edit article-button"
                onClick={() => this.props.handleEdit(thread)}></i>

              <i className="fas fa-trash-alt article-button"
                onClick={this.toggleDeleteWarning}></i>

            </div>}
        </div>

        <p className="thread-text">
          <i className=" fas fa-user"></i>{`  ${thread.user}`}
        </p>

        <p className="time" >{time}</p>
        <p className="time" >
          {`@ article(s): ${thread.article}`}
        </p>

        {thread.paragraph && <p className="thread-text" >{thread.paragraph}</p>}

        {/* the content expander button */}
        <div className="left-all-row">
          <p className="thread-text">{`${thread.commentsCount} comments`}</p>

          <Button
            style={styles.expandButton}
            color="link" size="md"
            onClick={this.toggleContent}>
            <i className={this.state.showContent ? "fas fa-angle-double-up" : "fas fa-angle-double-down"}></i>
          </Button>
        </div>

        <Collapse style={{ width: '100%' }} isOpen={this.state.showContent}>

          <CSSTransitionGroup
            style={styles.transitionGroup}
            transitionName="drop"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>

            {thread.comments &&
              this.renderComments(thread)}

            {/* the boolean for this is inside the function, since we are using a Collapse element */}
            {this.renderCommentForm()}

            {/* this uses the same boolean, flipped */}
            {this.props.user &&
              <Fade style={styles.button} in={!this.state.showCommentForm}>
                <Button disabled={this.state.showCommentForm} className="view article-button" size="sm"
                  onClick={this.toggleCommentForm}>comment</Button>
              </Fade>}

          </CSSTransitionGroup>
        </Collapse>
      </div>
    )
  }

  renderComments(thread) {
    return thread.comments.map((comment, i) => {

      return (
        <Comment key={i} comment={comment} />
      )

    })
  }

  render() {

    return (
      <div className="outline">

        <AlertModal
          message={`Are you sure you want to delete this thread?`}
          isVisible={this.state.showDeleteWarning}
          confirm={this.handleDeleteThread}
          confirming={true}
          toggle={this.toggleDeleteWarning}
        />

        {this.renderThread(this.props.thread)}

      </div>
    );
  }
}

const styles = {
  threadContainer: {
    width: '100%',
    // padding: '10px',
    // paddingTop: '20px'
  },
  title: {
    width: '75%'
  },
  button: {
    alignSelf: 'flex-end',
  },
  expandButton: {
    margin: '4px'
  },
  transitionGroup: {
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  buttonHolder: {
    // position: 'absolute',
    // top: '10px',
    // right: '10px',
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'row'
  },
  hr: {
    backgroundColor: 'rgba(245,245,245,0.1)',
    margin: '4px',
    padding: 0
  }
}

export default Thread;
