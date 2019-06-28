import React from 'react';
import '../App.scss';
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
      <div className={this.props.class || "glass"} style={styles.content}>
        <h4 className="subtitle" style={{ alignSelf: 'flex-start', margin: '10px' }}>{this.props.text.title}</h4>

        {this.props.text.paragraph.map((el, i) =>
          <p key={i} className="text" style={{ alignSelf: 'flex-start' }}>{el}</p>
        )}

        <Button color='secondary' size="sm" className="block-button">{this.props.text.button}</Button>

      </div>

    );
  }
}

const styles = {
  content: {
    margin: '0px 0px 0px 4px ',
    height: '100%',
  },
  text: {
    color: 'white'
  },

}

export default TextBlock;
