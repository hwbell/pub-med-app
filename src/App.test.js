import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

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

  let wrapper;
  beforeEach(() => {
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


  //   it('should render the dang thing', () => {
  //     const component = mount(
  //         <div>
  //             <Media query="(max-width: 721px)">
  //                 { matches => matches ? (
  //                     <div>This matches</div>
  //                 ) : <div>This doesn't match</div> }
  //             </Media>
  //         </div>
  //     );
  //     expect(component).toMatchSnapshot();
  // });

})


