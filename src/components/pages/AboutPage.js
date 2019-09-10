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

            <div style={{ marginTop: '10px' }}>

              <div className="space-all-row">
                <p className="profile-title" >About this Site</p>
                <AnchorLink style={styles.anchorLink} className="anchor-link" offset='100' href='#aboutpmc'>about PMC</AnchorLink>
              </div>

              {aboutPageText.full.top.map((section, i) => {
                return (
                  <div key={i}>
                    <div style={styles.titleHolder}>
                      {section.title && <p className="paragraph" style={{ marginBottom: '0px', fontWeight: 'bold' }}>{section.title}</p>}

                      <Link to={section.icon.route || '/about'}>
                        <i key={i} className={section.icon.className}></i>
                      </Link>
                    </div>

                    {section.text.map((text, j) => {
                      return <p key={j} className="paragraph">
                        {text}
                        {i === 2 && j === 0 &&
                          <Link to={'/profile'}>
                            {`  Make a profile!`}
                          </Link>}
                      </p>
                    })}
                  </div>
                )
              })}
            </div>

          </div>

          <div id="aboutpmc" className="outline" style={styles.content}>

            <div style={{ marginTop: '10px' }}>

              <div className="space-all-row">
                <p className="profile-title">About PubMed Central</p>
                <AnchorLink style={styles.anchorLink} className="anchor-link" offset='100' href='#aboutportal'>about the site</AnchorLink>
              </div>

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
  anchorLink: {
    paddingRight: '10px'
  }

}

export default AboutPage;
