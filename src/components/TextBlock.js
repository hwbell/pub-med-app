import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';

var ncbi = require('node-ncbi');

// elements

// styling
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// elements

class TextBlock extends React.Component {
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
      <div className="glass" style={styles.content}>
        <h4 className="subtitle" style={{ alignSelf: 'flex-start', margin: '10px' }}>{this.props.text.title}</h4>

        {this.props.text.paragraph.map((el, i) =>
          <p key={i} className="paragraph" style={{ alignSelf: 'flex-start' }}>{el}</p>
        )}

        <Button color='secondary' size="sm" className="block-button">{this.props.text.button}</Button>

      </div>

    );
  }
}

const styles = {
  content: {
    // width: '100%',
  },
  text: {
    color: 'white'
  },

}

export default TextBlock;
