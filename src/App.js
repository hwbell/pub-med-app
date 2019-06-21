import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

// components
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import Navigator from './components/Navigator';

// routing
import Router from 'react-router-dom/BrowserRouter';
import Route from 'react-router-dom/Route';
import { Switch, Link } from 'react-router-dom';
import posed, { PoseGroup } from 'react-pose';

const RoutesContainer = posed.div({
  enter: {
    opacity: 1,
    // delay: 300,
    beforeChildren: true
  },
  exit: { opacity: 0 }
});

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

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 'home'
    };

  }

  render() {
    return (
      <Router>

        {/* Try and put this Navigator in its own component. There was an issue with the router
          so it is here temporarily */}
        <div className="fixed-top navigator" style={styles.main}>

          <div className="row">
            <Link to="/" id="logo" className="nav-link">PubMed</Link>
          </div>

          <div className="row links-holder">
            {links.map((link, i) => {
              return (
                <Link className="nav-link" key={i} to={link.link}>{link.title}</Link>
              )
            })}
          </div>


        </div>

        <div id="App">

          <Route render={({ location }) => (
            // pose is kind of awesome! and super easy for a simple 
            // implementation like this
            <PoseGroup>

              <RoutesContainer key={location.pathname}>

                <Switch location={location}>
                  <Route exact path="/" component={HomePage} />
                  <Route path="/about/" component={AboutPage} />
                </Switch>

              </RoutesContainer>

            </PoseGroup>

          )} />

        </div>
      </Router>
    );
  }
}

export default App;

const styles = {
  main: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

}