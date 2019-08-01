import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';

// ******************************************************************************
class Comment extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { user, text } = this.props.comment;
    
    return (
      <div className="comment">

        <p className="comment-title">{`${user} - `}</p>

        <p className="comment-text">{text}</p>

      </div>
    );
  }
}

const styles = {

}

export default Comment;
