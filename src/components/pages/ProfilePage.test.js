import React from 'react';
import ProfilePage from './ProfilePage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// sample props
const user = {
  name: 'Harry',
  email: 'harry@example.com'
};

describe('ProfilePage', () => {
  // tests
  it('renders without crashing', async () => {
    let wrapper = shallow(<ProfilePage />);
    // wrapper.update();

  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<ProfilePage />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    let wrapper = mount(<ProfilePage />);

    ['.page', '.glass', , '.heading', '.outline'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    })

  });

  it('shows the signin form if user is not signed in', () => {
    let wrapper = mount(<ProfilePage />);
    wrapper.setProps({ signedIn: false });
    wrapper.update();
    expect(wrapper.find('.profile').length).toEqual(0);
    expect(wrapper.find('.signin').length).toEqual(1);

    // expect(wrapper.find('Form').length).toEqual(1);
    // expect(wrapper.find('.paragraph').length).toEqual(2);
    // expect(wrapper.find('Input').length).toEqual(4);
    // expect(wrapper.find('FormGroup').length).toEqual(1);
    // expect(wrapper.find('Label').length).toEqual(1);
    // expect(wrapper.find('Button').length).toEqual(1);

    // change the signedIn prop and provide a user 
    wrapper.setProps({
      signedIn: true,
      user
    });
    wrapper.update();
    // check for the change
    expect(wrapper.find('.profile').length).toEqual(1);
    expect(wrapper.find('.signin').length).toEqual(0);

  })

  it('should show the users profile once signed in', async () => {
    let wrapper = mount(<ProfilePage />);

    // at first, no profile
    expect(wrapper.find('.profile').length).toEqual(0);

    // change the state and check for its appearance. need to supply
    // a user as well

    wrapper.setProps({ signedIn: true });
    wrapper.setProps({ user });

    wrapper.update();
    expect(wrapper.find('.profile').length).toEqual(1);
  })

  it('handleCheck() should toggle the checkbox', () => {
    let wrapper = mount(<ProfilePage />);
    expect(wrapper.state().checked).toBe(false);
    expect(wrapper.find('Input').length).toEqual(4);

    // check it
    wrapper.instance().handleCheck();
    wrapper.update();
    expect(wrapper.state().checked).toBe(true);
    expect(wrapper.find('Input').length).toEqual(5);

    // uncheck it
    wrapper.instance().handleCheck();
    wrapper.update();
    expect(wrapper.state().checked).toBe(false);
    // wait for the css transition out
    setTimeout(() => {
      expect(wrapper.find('Input').length).toEqual(4);
    }, 500)

  })

  it('should fire handleSubmit() when the ', () => {
    let wrapper = mount(<ProfilePage />);

  })

})
