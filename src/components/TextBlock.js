import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
const Router = require("react-router-dom").BrowserRouter;


class TextBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null
    };
  }

  render() {
    console.log(this.props.linkTo)

    return (
      <div className={this.props.class || "glass"} style={styles.content}>
        <p className="thread-title">{this.props.text.title}</p>

        <div>
          {this.props.text.paragraph.map((el, i) =>
            <p key={i} className="paragraph" style={{ alignSelf: 'flex-start' }}>{el}</p>
          )}
        </div>

        <Button color='primary' size="sm" className="block-button"
          onClick={this.props.navigateToResource}>
          <Link to={this.props.linkTo || '/about'} style={{ color: 'white' }}>{this.props.text.button}</Link>
        </Button>

      </div>

    );
  }
}

const styles = {
  content: {
    height: '100%',
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
}

export default TextBlock;
