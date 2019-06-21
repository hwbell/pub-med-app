import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components

// elements

// styling
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// elements

class OutlinedText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 
    };
  }

  componentDidMount() {
    // 
  }

  render() {



    return (
      <div className="outline" style={styles.content}>
        
        <p className="paragraph" style={styles.text}>{ this.props.text }</p>

      </div>

    );
  }
}

const styles = {
  content: {
    width: '90%',
    margin: '10px'
  },
  text: {
    paddingTop: '10px',
  },

}

export default OutlinedText;
