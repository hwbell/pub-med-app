import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Comment from './Comment';
import { Button } from 'reactstrap';

// ******************************************************************************
class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.renderThread = this.renderThread.bind(this);
    this.renderComments = this.renderComments.bind(this);
  }

  renderThread() {

    let thread = this.props.thread;

    return (
      <div>

        <p className="profile-title">{thread.name}</p>
        <p className="paragraph">{thread.article}</p>

        <p className="paragraph">{thread.user}</p>

        {thread.paragraph && <p className="paragraph">{thread.paragraph}</p>}


        {thread.comments &&
          this.renderComments(thread)}

      </div>
    )
  }

  renderComments (thread) {
    return thread.comments.map((comment, i) => {

      console.log(comment)

      return (
        <Comment key={i} comment={comment}/>
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

}

export default Thread;
