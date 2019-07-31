import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import Thread from '../Thread';
import ThreadForm from '../ThreadForm';
import { Button } from 'reactstrap';

// ******************************************************************************
class ThreadPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showThreadForm: false
    }

    this.renderThreads = this.renderThreads.bind(this);
    this.toggleThreadForm = this.toggleThreadForm.bind(this);
  }

  renderThreads() {
    let threads = this.props.threads;

    return threads.map((thread, i) => {
      return <Thread key={i} thread={thread} />
    })
  }

  toggleThreadForm() {

    // set the selected thread if we are about to show the modal
    if(!this.state.showThreadForm) {

    }

    this.setState({
      showThreadForm: !this.state.showThreadForm
    }, () => {
      console.log(this.state.showThreadForm)
    })
  }

  render() {

    return (
      <div className="page">

        <ThreadForm
          toggle={this.toggleThreadForm}
          isVisible={this.state.showThreadForm}
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
