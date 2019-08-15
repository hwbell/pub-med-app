import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// tools
import { getSampleCollections } from './tools/sampleData';

// mock the server functions
jest.mock('./tools/serverFunctions.js');

// stubs
const renderDropDownStub = jest.fn();
const renderNavigatorStub = jest.fn();

const resizeWindow = (x, y) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent(new Event('resize'));
}

describe('App', () => {

  let user, wrapper;
  beforeEach(() => {

    user = {
      name: 'Mark',
      email: 'mark@example.com',
      password: 'password'
    }

    wrapper = shallow(<App />);
    wrapper.instance().registerSignIn = jest.fn();
  })


  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not have a user to start with', async () => {
    expect(wrapper.state().user).toBe(null)
  });

  it('contains the correct elements', () => {
    expect(wrapper.find('#App').length).toBe(1)
  })

  it('should try to sign in user if there is a user in local storage', async () => {

    jest.spyOn(wrapper.instance(), 'registerSignIn');

    // with no user it should not attempt
    // there should be no user at the start
    expect(localStorage.getItem('user')).not.toBeTruthy();

    // without user => false
    await wrapper.instance().componentDidMount();
    wrapper.update();
    expect(wrapper.instance().registerSignIn).not.toHaveBeenCalled();

    // set a user
    localStorage.setItem('user', JSON.stringify(user));

    // componentDidMount is where the decision is made whether or not to sign in
    await wrapper.instance().componentDidMount();
    wrapper.update();

    // with user => true
    expect(wrapper.instance().registerSignIn).toHaveBeenCalled();

  })

  it('should render full navigator menu when screen width > 649px', () => {
    const wrapper = mount(<App />);

    resizeWindow(1000, 800);

    wrapper.update();

    // there should always only be one navigator
    expect(wrapper.find('.navigator').length).toBe(1);

    expect(wrapper.find('#full-nav').length).toBe(1);


  })

  // it('should render dropdown menu when screen width < 649px', () => {
  //   const wrapper = mount(<App />);

  //   resizeWindow(600, 400);

  //   wrapper.update();

  //   // there should always only be one navigator
  //   expect(wrapper.find('.navigator').length).toBe(1);

  //   expect(wrapper.find('#dropdown').length).toBe(1);


  // })


  it('should set state correctly when refreshUserCollections() is fired', () => {
    expect(wrapper.state().user).toMatchObject(user);

    // can pass an array or object to this function, to account for different responses
    let newCollections = getSampleCollections();
    // pass an array, which will replace the user collections
    wrapper.instance().refreshUserCollections(newCollections);
    wrapper.update();
    expect(wrapper.state().user.collections).toMatchObject(newCollections);

    // pass an new colection, which will be added to the user collections
    let newObj = JSON.parse(JSON.stringify(newCollections[0]));
    newObj._id = '3242';
    newObj.owner = 'user3242';

    wrapper.instance().refreshUserCollections(newObj);
    wrapper.update();
    // length increased by one, and the new collection is the first in the list
    expect(wrapper.state().user.collections.length).toBe(11);
    expect(wrapper.state().user.collections[0]).toMatchObject(newObj);

    // pass an updated object, which will replace the old object
    newObj.name = 'new name';
    newObj.articles.push({
      name: 'article 3242', 
    });
    console.log(newObj)

    wrapper.instance().refreshUserCollections(newObj);
    wrapper.update();
    // length stays the same, and the new collection is the first in the list
    expect(wrapper.state().user.collections.length).toBe(11);
    expect(wrapper.state().user.collections[0]).toMatchObject(newObj);
  })

})


