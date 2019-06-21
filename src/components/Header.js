import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

var ncbi = require('node-ncbi');

// elements

// styling
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// elements

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null

    };
  }

  componentDidMount() {
  // 
  }

  render() {
    return (
      <div className="glass full-width">
        
          <h2 className="title">{this.props.title}</h2>
          <h4 className="subtitle">{this.props.subtitle}</h4>

      </div>
    );
  }
}

const styles = {
  main: {
    padding: '10px'
  },
  text: {
    color: 'white'
  }

}

export default Header;
