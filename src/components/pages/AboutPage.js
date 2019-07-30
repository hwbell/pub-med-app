import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { aboutPageText } from "../../assets/text";
// components
import Header from '../Header';
import OutlinedText from '../OutlinedText';

// elements

// styling
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class AboutPage extends React.Component {
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
      <div className="about-page page">
        <div className="glass page-content">

          <Header
            class="heading"
            title={"About PubMed Central"}
            subtitle={"medical & life sciences literature for the public"}
          />

          <div className="outline" style={styles.content}>

            <p className="paragraph" style={styles.text}>{aboutPageText.full.top}</p>

          </div>

          <img style={{ margin: '15px', borderRadius: '10px' }} src={require('../../assets/about-page.png')}></img>

          <OutlinedText
            text={aboutPageText.full.bottom}
          />

        </div>
      </div>
    );
  }
}

const styles = {
  main: {
    width: '100%'
  }
}

export default AboutPage;
