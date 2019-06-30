import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.scss';

// components
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import SearchPage from './components/pages/SearchPage'
import CollectionPage from './components/pages/CollectionPage';

// pose animation
import posed, { PoseGroup } from 'react-pose';

// routing
import { Switch, Link } from 'react-router-dom';
// import Router from 'react-router-dom/BrowserRouter';
const Router = require("react-router-dom").BrowserRouter;
// import Route from 'react-router-dom/Route';
const Route = require("react-router-dom").Route;

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
      collections: [],
    };

    this.createNewCollection = this.createNewCollection.bind(this);
    this.modifyCollection = this.modifyCollection.bind(this);
  }

  setRef = ref => this.ref = ref;

  modifyCollection(article, collectionName, change, callback) {

    // if no collectionName / article, return
    if (!article || !collectionName) {
      return;
    }

    let verb = change > 0 ? 'Adding' : 'Removing';
    console.log(`${verb} article ${article.id} to user's ${collectionName} collection`)

    // then find the matching collection and add / remove the article
    let collections = this.state.collections;
    collections.forEach((collection, i) => {

      if (collection.name === collectionName) {
        console.log('found matching collection')

        if (change > 0) {
          collection.articles.push(article);
        } else {
          collection.articles.splice(i,1);
        }
        
      }
    });

    this.setState({
      collections
    }, () => callback());
  }


  createNewCollection(collection, callback) {
    console.log('creating new collection');

    let collections = this.state.collections;
    collections.push(collection);

    this.setState({
      collections
    }, () => callback());
  }

  render() {
    return (
      <Router>

        {/* Try and put this Navigator in its own component if necessary? Its not resuasable so maybe
          not. There was an issue with the router(I think just w. enzyme tests) so it is here for now */}

        <div className="fixed-top navigator" style={styles.main}>

          <div className="row">
            <Link to="/" id="logo" className="nav-link">PubMed</Link>
          </div>

          <div className="row links-holder">
            {links.map((link, i) => {
              return (
                <Link className="nav-link" style={styles.link} key={i} to={link.link}>{link.title}</Link>
              )
            })}

            <Link className="nav-link" style={styles.link} to="/profile">
              <i className="far fa-user"></i>
            </Link>
          </div>


        </div>

        <div id="App">

          <Route render={({ location }) => (


              <div key={location.pathname}>

                <Switch location={location}>
                  <Route exact path="/" component={HomePage} />
                  <Route path="/about/" component={AboutPage} />
                  <Route path="/search/" render={() =>
                    <SearchPage
                      collections={this.state.collections}
                      createNewCollection={this.createNewCollection}
                      modifyCollection={this.modifyCollection} />
                  } />
                  <Route path="/collections/" render={() =>
                    <CollectionPage
                      collections={this.state.collections}
                      modifyCollection={this.modifyCollection}
                    />
                  } />

                </Switch>

              </div>

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
  link: {
    fontSize: '22px'
  }
}