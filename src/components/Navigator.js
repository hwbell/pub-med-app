import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// styling
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// routing with react-router
import { Link } from 'react-router-dom';

const links = [
  {
    title: 'About',
    link: '/about'
  },
  {
    title: 'Search',
    link: '/search'
  },
  {
    title: 'Collections',
    link: '/collections'
  },

]

class Navigator extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 
  }

  render() {
    return (

      <div className="fixed-top navigator" style={styles.main}>

        <div className="row">
          <a href="#home" id="logo" className="nav-link">PubdddddMed</a>
        </div>

        <div className="row links-holder">
          {links.map((link, i) => {
            return (
              <a className="nav-link" style={styles.link} key={i} href={link.link}>{link.title}</a>
            )
          })}
        </div>


      </div>
    );
  }
}

const styles = {
  main: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  link: {
    fontSize: '24px'
  }

}

export default Navigator;
