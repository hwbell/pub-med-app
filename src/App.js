import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.scss';

// components
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import SearchPage from './components/pages/SearchPage'
import CollectionPage from './components/pages/CollectionPage';
import ThreadPage from './components/pages/ThreadPage';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Media from "react-media";

// pose animation
import posed, { PoseGroup } from 'react-pose';
import styled from "styled-components";

// routing
import { Switch, Link } from 'react-router-dom';
import ProfilePage from './components/pages/ProfilePage';

// tools / functions
import { getUserCollections } from './tools/serverFunctions';
import { addArticle, removeArticle, updateObjInArray } from './tools/arrayFunctions';

// more routing .... dev console warning said to change it to this instead of import?
const Router = require("react-router-dom").BrowserRouter;
const Route = require("react-router-dom").Route;

const RoutesContainer = posed.div({
  enter: {
    transition: {
      ease: 'easeIn', duration: 200
    },
    opacity: 1,
    // x: 0
  },
  exit: {
    // delay: 300,
    transition: {
      ease: 'easeOut', duration: 100
    },
    opacity: 0,
    // x: 10
  }
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
  {
    title: 'Threads',
    link: '/threads'
  },
]

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      serverThreads: null,
      user: null,
      userCollections: [],
      dropdownOpen: false
    };

    this.toggle = this.toggle.bind(this);
    this.renderNavigator = this.renderNavigator.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
    // these functions are for collections that are only in the App state, not yet stored
    // on the backend
    this.createNewCollection = this.createNewCollection.bind(this);
    this.modifyCollection = this.modifyCollection.bind(this);
    this.deleteCollection = this.deleteCollection.bind(this);

    // these actually communicate with our server
    this.registerSignIn = this.registerSignIn.bind(this);
    this.registerSignOut = this.registerSignOut.bind(this);
    this.refreshUserCollections = this.refreshUserCollections.bind(this);
    this.refreshUserThreads = this.refreshUserThreads.bind(this);
    this.refreshUser = this.refreshUser.bind(this);

    this.registerServerThreads = this.registerServerThreads.bind(this);
    this.refreshServerThreads = this.refreshServerThreads.bind(this);
    this.deleteThread = this.deleteThread.bind(this);

  }

  componentDidMount() {
    // sign in on startup if there is a token in localStorage
    if (localStorage.getItem('user') && localStorage.getItem('user') !== "undefined") {
      // console.log(localStorage.getItem('user'))
      let user = JSON.parse(localStorage.getItem('user'));
      return this.registerSignIn(user);
    }
  }

  createNewCollection(collection, callback) {
    console.log('creating new collection');

    let collections = this.state.collections;
    collections.push(collection);

    this.setState({
      collections
    }, () => {
      callback()
      localStorage.setItem('collections', JSON.stringify(collections))
    });
  }

  deleteCollection(collectionToDelete, callback) {
    let name = collectionToDelete.name;
    console.log(name)
    let collections = this.state.collections.filter(collection => collection.name !== name);

    localStorage.setItem('collections', JSON.stringify(collections));

    this.setState({
      collections
    }, () => {
      callback();
    })

  }

  // this will be called:
  //   1. when adding an article from the search page
  //   2. when removing an article from the collection page (only state collections, not server collections)
  modifyCollection(article, collectionName, change, callback) {

    // if no collectionName / article, return
    if (!article || !collectionName) {
      return;
    }

    // to handle an object with 'name' key as well
    if (collectionName.name) {
      collectionName = collectionName.name
    }

    let verb = change > 0 ? 'Adding' : 'Removing';
    console.log(`${verb} article ${article.id} in user's ${collectionName} collection`)

    let collections = this.state.collections;

    if (change > 0) {
      collections = addArticle(collections, collectionName, article)
    } else {
      collections = removeArticle(collections, collectionName, article)
    }

    console.log(collections)

    if (callback) {
      localStorage.setItem('collections', JSON.stringify(collections))
      this.setState({
        collections
      }, () => callback());
    } else {
      this.setState({
        collections
      }, () => {
        localStorage.setItem('collections', JSON.stringify(collections))
      });
    }
  }

  // fire this function 
  // 1. when a user signs in from the user page 
  // 2. Upon startup if there is a localStorage user + token

  // we'll save the user to the state / localStorage, as well as retrieve the user's collections
  // and save that too
  registerSignIn(user) {

    this.setState({ user });

    let token = JSON.parse(localStorage.getItem('token'));
    let headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    // we actually get the collections as well as the profile here, maybe change the name
    return getUserCollections(headers)
      .then((response) => {

        // attach the collections to the user object
        let profile = response.user;
        if (!user) {
          return;
        }
        profile.collections = response.collections;
        profile.threads = response.threads;


        // save to state
        this.setState({
          user: profile
        }, () => {
          console.log(this.state.user)
        });
        // save info to local storage
        localStorage.setItem(`user`, JSON.stringify(profile));

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  // this will also be called from the Profile component
  registerSignOut() {
    this.setState({
      collections: [],
      user: null,
      userCollections: []
    });
    // wipe the user from localStorage to prevent sign in on startup
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // this function is triggered from the CollectionPage when a user changes their collections
  // on the server. The updated user collections are sent from the server upon update and sent 
  // back to App to keep App as the root source of the current user data
  refreshUserCollections(response) {

    console.log('refreshing users collections')
    let { user } = this.state;

    // for sorting / deletions we get a list back. check for this
    // if there are none left, it will be empty, but this is ok
    if (!response._id) {
      user.collections = response;
      return this.setState({
        user
      }, () => {
        // save to local storage
        localStorage.setItem(`user`, JSON.stringify(user));
      })
    }

    // if we get an object, replace the matching collection with the response
    // the updateObjInArray function will handle whether the response is a new collection or an update
    user.collections = updateObjInArray(user.collections, response);

    this.setState({
      user
    }, () => {
      // save to local storage
      localStorage.setItem(`user`, JSON.stringify(user));
    })
  }

  refreshUserThreads(response) {
    // all we have to do is replace the matching thread with the response

    console.log('refreshing users threads')
    let { user } = this.state;

    // for sorting / deletions we get a list back. check for this
    // if there are none left, it will be empty, but this is ok
    if (!response._id) {
      user.threads = response;
      return this.setState({
        user
      }, () => {
        // save to local storage
        localStorage.setItem(`threads`, JSON.stringify(user));
      })
    }

    // the updateObjInArray function will handle whether the response is a new thread or an update
    user.threads = updateObjInArray(user.threads, response);

    this.setState({
      user
    }, () => {
      // save to local storage
      localStorage.setItem(`user`, JSON.stringify(user));
    })

  }

  // this function is triggered when a thread is saved / modified from the ThreadPage
  refreshServerThreads(response) {

    // for sorting / deletions we get a list back. check for this
    // if there are none left, it will be empty, but this is ok
    if (!response._id) {
      return this.setState({
        serverThreads: response
      }, () => {
        // save to local storage
        localStorage.setItem(`serverThreads`, JSON.stringify(response));
      })
    }

    // otherwise update the thread accordingly
    let { serverThreads } = this.state;

    // the updateObjInArray function will handle whether the response is a new thread or an update
    let updatedThreads = updateObjInArray(serverThreads, response);

    this.setState({
      serverThreads: updatedThreads
    }, () => {
      console.log(this.state.serverThreads)
    })
  }

  // this function is triggered from the ProfileForm in ProfilePage when a user changes their info
  // The updated user is sent from the server upon update and sent 
  // back to App to keep App as the root source of the current user data
  refreshUser(response) {

    // all we have to do is set the response as the user
    // but remember to re-attach the user's collections to the user object
    response.collections = this.state.user.collections;
    response.threads = this.state.user.threads;

    this.setState({
      user: response
    }, () => {
      // save to local storage
      localStorage.setItem(`user`, JSON.stringify(this.state.user));
    });

  }

  // this function is fired from ThreadPage when we get the whole list of server threads
  registerServerThreads(response) {
    this.setState({
      serverThreads: response
    })
  }

  // delete the thread from user + serverThreads
  deleteThread(thread) {
    let { user, serverThreads } = this.state;

    // filter out the thread from user and serverThreads. 
    user.threads = user.threads.filter(item => item.name !== thread.name);
    serverThreads = serverThreads.filter(item => item.name !== thread.name);

    this.setState({
      user,
      serverThreads
    })

    // This single item response from the server + update in state may not be the best, since we are not making 
    // a clean refresh straight from the server. But it is less intensive for the server, and there are spots 
    // where refreshing naturally happens anyhow. Maybe change this later, though.
  }

  renderNavigator() {
    return (
      <div className="fixed-top navigator" id="full-nav" style={styles.nav}>

        <Link to="/" id="logo" className="nav-link">PubMed</Link>

        <div className="row links-holder">
          {links.map((link, i) => {
            return (
              <Link className="nav-link" style={styles.link} key={i} to={link.link}>{link.title}</Link>
            )
          })}

          <Link className="nav-link" style={styles.link} to="/profile/">
            <i className="fas fa-user-cog"></i>
          </Link>
        </div>


      </div>
    )
  }

  renderDropdown() {
    return (
      <div className="fixed-top navigator" id="dropdown" style={styles.nav}>

        <Link to="/" id="logo" className="nav-link">PubMed</Link>

        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle color="primary" caret>
            go to
        </DropdownToggle>
          <DropdownMenu>
            {links.map((link, i) => {
              return (
                <Link className="nav-link" style={styles.link} key={i} to={link.link}>{link.title}</Link>
              )
            })}

            <Link className="nav-link" style={styles.link} to="/profile/">
              <i className="fas fa-user-cog"></i>
            </Link>
          </DropdownMenu>
        </Dropdown>


      </div>
    )
  }

  toggle() {
    this.setState(state => ({ dropdownOpen: !state.dropdownOpen }));
  }

  render() {

    return (
      <Router>

        {/* Try and put this Navigator in its own component if necessary? Its not resuasable so maybe
          not. There was an issue with the router(I think just w. enzyme tests) so it is here for now */}

        <Media query="(max-width: 649px)">
          {matches =>
            matches ? (
              this.renderDropdown()
            ) : (
                this.renderNavigator()
              )
          }
        </Media>

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
                      refreshUserCollections={this.refreshUserCollections}
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
                  <Route path="/threads/" render={() =>
                    <ThreadPage
                      serverThreads={this.state.serverThreads}
                      user={this.state.user}
                      refreshUserThreads={this.refreshUserThreads}
                      refreshServerThreads={this.refreshServerThreads}
                      registerServerThreads={this.registerServerThreads}
                      deleteThread={this.deleteThread}
                    />

                  } />
                  <Route path="/profile/" render={() =>
                    <ProfilePage
                      registerSignIn={this.registerSignIn}
                      registerSignOut={this.registerSignOut}
                      refreshUser={this.refreshUser}
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

export default App;

// export default App;

const styles = {
  nav: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  link: {
    fontSize: ' 18px'
  }
}