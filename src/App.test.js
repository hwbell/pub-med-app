import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// stubs
// const signI

describe('App', () => {



  it('renders without crashing', async () => {
    let wrapper = await shallow(<App />);
  });

  it('renders correctly', async () => {
    let wrapper = mount(<App />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should not have a user to start with', async () => {
    let wrapper = mount(<App />);

    expect(wrapper.state().user).toBe(null)
  });

  it('should try to sign in user if there is a user in local storage', async () => {

    const wrapper = mount(<App/>);
    jest.spyOn(wrapper.instance(), 'registerSignIn');

    // with no user it should not attempt
    // there should be no user at the start
    expect(localStorage.getItem('user')).not.toBeTruthy();

    // without user => false
    await wrapper.instance().componentDidMount();
    wrapper.update();
    expect(wrapper.instance().registerSignIn).not.toHaveBeenCalled();

    // with fake user it should attempt
    let user = {
      name: 'Mark',
      email: 'mark@example.com',
      password: 'password'
    }

    // set a user
    localStorage.setItem('user', JSON.stringify(user));

    // componentDidMount is where the decision is made whether or not to sign in
    await wrapper.instance().componentDidMount();
    wrapper.update();

    // with user => true
    expect(wrapper.instance().registerSignIn).toHaveBeenCalled();

  })

})


