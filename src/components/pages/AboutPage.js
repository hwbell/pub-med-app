import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { aboutPageText } from "../../assets/text";
// components
import Header from '../Header';

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
            title={"About this Site"}
            subtitle={"medical & life sciences literature for everyone"}
          />

          <div className="outline" style={styles.content}>

          {/* 'far fa-file-alt', 'fas fa-project-diagram', 'fas fa-users' */}

            <div className="row" style={{margin: '20px', marginBottom: '0px'}}>
              <i style={styles.icon} className="far fa-file-alt"></i>
              <i style={styles.icon} className="fas fa-project-diagram"></i>
              <i style={styles.icon} className="fas fa-users"></i>
            </div>

            {aboutPageText.full.top.map((section, i) => {
              return (
                <div key={i}>
                  <div style={styles.titleHolder}>
                    {section.title && <p className="profile-title">{section.title}</p>}

                    <div className="row">
                      {section.icons.map((icon, i) => {
                        return <i key={i} className={icon}></i>
                      })}
                    </div>
                  </div>

                  {section.text.map((text, i) => {
                    return <p key={i} className="paragraph">{text}</p>
                  })}
                </div>
              )
            })}

          </div>

          <div className="outline" style={styles.content}>

            <p className="profile-title">About PMC</p>
            <p className="paragraph">{aboutPageText.full.middle[0]}</p>
            <p className="paragraph">{aboutPageText.full.middle[1]}</p>

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
}

export default AboutPage;
