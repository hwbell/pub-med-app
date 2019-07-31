import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Comment from './Comment';
import { Button, Fade, Collapse } from 'reactstrap';
import CommentForm from './CommentForm';

// enter / exit transitions
import { CSSTransitionGroup } from 'react-transition-group' // ES6

// ******************************************************************************
class Thread extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      showCommentForm: false
    }

    this.renderThread = this.renderThread.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.toggleCommentForm = this.toggleCommentForm.bind(this);
    this.renderCommentForm = this.renderCommentForm.bind(this);
    this.submitComment = this.submitComment.bind(this);
  }

  toggleCommentForm() {
    this.setState({
      showCommentForm: !this.state.showCommentForm
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
    console.log(`submitting ${comment.user}'s comment to ${this.props.thread.name} thread:
    ${comment.text}`)
  }

  renderThread() {

    let thread = this.props.thread;

    let subtitle = `thread by: ${thread.user}`;

    if (thread.article) {
      subtitle += `, concerning ${thread.article}`
    }
    return (
      <div style={styles.threadContainer}>

        <p className="profile-title" style={styles.text}>{thread.name}</p>
        <p className="paragraph" style={styles.text}>{subtitle}</p>

        {thread.paragraph && <p className="paragraph" style={styles.text}>{thread.paragraph.slice(0, 50) + ` ...`}</p>}


        <CSSTransitionGroup
          style={styles.transitionGroup}
          transitionName="drop"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>

          {/* the boolean for this is inside the function, since we are using a Collapse element */}
          {this.renderCommentForm()}

          {/* {!this.state.showCommentForm && */}


          <Fade in={!this.state.showCommentForm}>
            <Button className="view article-button" size="sm"
              style={styles.button}
              onClick={this.toggleCommentForm}>comment</Button>
          </Fade>

          {thread.comments &&
            this.renderComments(thread)}

        </CSSTransitionGroup>
      </div>
    )
  }

  renderComments(thread) {
    return thread.comments.map((comment, i) => {

      console.log(comment)

      return (
        <Comment key={i} comment={comment} />
      )

    })
  }

  render() {

    return (
      <div className="outline">

        {this.renderThread(this.props.thread)}

      </div>
    );
  }
}

const styles = {
  threadContainer: {
    width: '100%',
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  button: {
    alignSelf: 'flex-end',
    margin: '10px'
  },
  transitionGroup: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
}

export default Thread;
