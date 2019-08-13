import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components

// elements

// styling
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// elements

class OutlinedText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let alignSelf = this.props.alignLeft ? 'flex-start' : '';
    const styles = {
      content: {
        width: '100%',
        margin: '4px'
      },
      text: {
        paddingTop: '10px',
        alignSelf
      },
      title: {
        alignSelf
      }
    }

    return (
      <div className="outline" style={styles.content}>

        {this.props.title &&
          <p className="thread-title" style={styles.title}>{this.props.title}</p>
        }

        <p className="paragraph" style={styles.text}>{this.props.text}</p>

      </div>

    );
  }
}

export default OutlinedText;
