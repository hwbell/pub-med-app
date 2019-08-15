import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

var ncbi = require('node-ncbi');

// elements

// styling
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// elements

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className || "header left-all-col"} >
        
          <h2 className="title">{this.props.title}</h2>
          <h4 className="subtitle" style={{alignSelf: 'center'}}>{this.props.subtitle}</h4>

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
  },
  container: {
    width: '60%'
  }

}

export default Header;
