import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// elements

// styling
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// elements


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

        <div className="glass navigator" style={styles.main}>

          <h1>PMC</h1>

          <div className="row links-holder">
            {links.map((link, i) => {
              return (
                <a className="nav-link" key={i}  href={link.link}>{link.title}</a>
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
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    color: 'white'
  }

}

export default Navigator;
