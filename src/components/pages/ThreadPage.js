import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import Thread from '../Thread';
import { Button } from 'reactstrap';

// ******************************************************************************
class ThreadPage extends React.Component {
  constructor(props) {
    super(props);

    this.renderThreads = this.renderThreads.bind(this);
  }

  renderThreads () {
    let threads = this.props.threads;

    return threads.map((thread, i) => {
      return <Thread key={i} thread={thread}/>
    })
  }

  render() {

    return (
      <div className="page">
        <div className="glass page-content" >

          {/* the header */}
          <Header
            class="heading"
            title={"PMC Threads"}
            subtitle={"post a thread to start a discussion"}
          />

          {this.props.threads && this.renderThreads()}

        </div>

      </div>
    );
  }
}

const styles = {

}

export default ThreadPage;
