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

        <p className="profile-title">{user}</p>

        <p className="paragraph">{text}</p>

        <hr></hr>


      </div>
    );
  }
}

const styles = {

}

export default Comment;
