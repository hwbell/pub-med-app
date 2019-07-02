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
import ProfilePage from './components/pages/ProfilePage';

// tools
import { getUserCollections } from './tools/serverFunctions';

// more routing .... dev console warning said to change it to this instead of import?
const Router = require("react-router-dom").BrowserRouter;
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
      user: null,
      userCollections: []
    };

    // these functions are for collections that are only in the App state, not yet stored
    // on the backend
    this.createNewCollection = this.createNewCollection.bind(this);
    this.modifyCollection = this.modifyCollection.bind(this);
    this.deleteCollection = this.deleteCollection.bind(this);
    this.registerSignIn = this.registerSignIn.bind(this);
    this.refreshUserCollections = this.refreshUserCollections.bind(this);
  }

  createNewCollection(collection, callback) {
    console.log('creating new collection');

    let collections = this.state.collections;
    collections.push(collection);

    this.setState({
      collections
    }, () => callback());
  }

  deleteCollection(collectionToDelete, callback) {
    let name = collectionToDelete.name;
    console.log(name)
    let collections = this.state.collections.filter( collection => collection.name !== name );

    this.setState({
      collections
    }, () => {
      callback();
    })
    
  }

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
          collection.articles.splice(i, 1);
        }

      }
    });

    this.setState({
      collections
    }, () => callback());
  }

  // when a user signs in from the user page it will fire this function
  // we'll save the user to the state, as well as retrieve the user's collections
  // and save that too
  registerSignIn(user) {
    this.setState({
      user: user
    }, () => {
      console.log(this.state.user)
    });

    let token = JSON.parse(localStorage.getItem('token'));
    let headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    return getUserCollections(headers)
      .then((response) => {
        console.log(response)

        // save to state
        this.setState({
          userCollections: response
        });
        // save info to local storage
        localStorage.setItem(`user-collections`, JSON.stringify(response));

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  // this function is triggered from the CollectionPage when a user changes their collections
  // on the server. The updated user collections are sent from the server upon update and sent 
  // back to App to keep App as the root source of the current user data
  refreshUserCollections (response) {
    // all we have to do is set the response as the userCollections
    this.setState({
      userCollections: response
    })
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

            <Link className="nav-link" style={styles.link} to="/profile/">
              <i className="far fa-user"></i>
            </Link>
          </div>


        </div>

        <div id="App">

          <Route render={({ location }) => (

            // pose is awesome 
            <PoseGroup>

              <RoutesContainer key={location.pathname}>

                <Switch location={location}>
                  <Route exact path="/" component={HomePage} />
                  <Route path="/about/" component={AboutPage} />
                  <Route path="/search/" render={() =>
                    <SearchPage
                      collections={this.state.collections}
                      createNewCollection={this.createNewCollection}
                      modifyCollection={this.modifyCollection}
                      user={this.state.user} />
                  } />
                  <Route path="/collections/" render={() =>
                    <CollectionPage
                      collections={this.state.collections}
                      modifyCollection={this.modifyCollection}
                      deleteCollection={this.deleteCollection}
                      refreshUserCollections={this.refreshUserCollections}
                      user={this.state.user}
                    />
                  } />
                  <Route path="/profile/" render={() =>
                    <ProfilePage
                      registerSignIn={this.registerSignIn}
                      user={this.state.user}
                    />
                  } />
                </Switch>

              </RoutesContainer>

            </PoseGroup>

          )} />

        </div>
      </Router>
    );
  }
}

export default React.forwardRef((props, ref) => <App innerRef={ref} {...props} />);

// export default App;

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