import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { aboutPageText } from "../../assets/text";

// components
import Header from '../Header';
import AnchorLink from 'react-anchor-link-smooth-scroll'
import { Link } from 'react-router-dom';

class AboutPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 
    };
  }

  componentDidMount() {
    // setTimeout(() => {
    // window.scrollTo(0,0);
    // }, 1000)
  }

  render() {
    return (
      <div className="about-page page">
        <div className="glass page-content">

          <Header
            class="heading"
            title={"A Portal to PMC"}
            subtitle={"medical & life sciences literature for everyone"}
          />

          <div id="aboutportal" className="outline" style={styles.content}>

            <div style={styles.linkHolder}>
              <AnchorLink className="anchor-link" offset='100' href='#aboutpmc'>about PMC</AnchorLink>
            </div>

            <div style={{ marginTop: '20px' }}>

              <p className="profile-title" >About this Site</p>
              {aboutPageText.full.top.map((section, i) => {
                return (
                  <div key={i}>
                    <div style={styles.titleHolder}>
                      {section.title && <p className="paragraph" style={{ marginBottom: '0px' }}>{section.title}</p>}

                      <Link to={section.icon.route || '/about'}>
                        <i key={i} className={section.icon.className}></i>
                      </Link>
                    </div>

                    {section.text.map((text, i) => {
                      return <p key={i} className="paragraph">{text}</p>
                    })}
                  </div>
                )
              })}
            </div>

          </div>

          <div id="aboutpmc" className="outline" style={styles.content}>

            <div style={styles.linkHolder}>
              <AnchorLink className="anchor-link" offset='100' href='#aboutportal'>about the site</AnchorLink>
            </div>

            <div style={{ marginTop: '20px' }}>
              <p className="profile-title">About PubMed Central</p>
              <p className="paragraph">{aboutPageText.full.middle[0]}</p>
              <p className="paragraph">{aboutPageText.full.middle[1]}</p>
            </div>
          </div>

          <img className="about-img" src={require('../../assets/about-page.png')}></img>

          <div className="outline" style={styles.content}>

            {aboutPageText.full.bottom.map((section, i) => {
              return <p key={i} className="paragraph">{section}</p>
            })}



          </div>

        </div>
      </div>
    );
  }
}

const styles = {
  main: {
    width: '100%'
  },
  titleHolder: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  linkHolder: {
    position: 'absolute',
    right: '20px',
    top: '2px',
    zIndex: 10,
    display: 'flex',
    fontSize: '14px'
  }

}

export default AboutPage;
