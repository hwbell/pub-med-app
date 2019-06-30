import React from 'react';
import ProfilePage from './ProfilePage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

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

    expect(wrapper.find('Form').length).toEqual(1);
    expect(wrapper.find('.paragraph').length).toEqual(2);
    expect(wrapper.find('Input').length).toEqual(4);
    expect(wrapper.find('FormGroup').length).toEqual(1);
    expect(wrapper.find('Label').length).toEqual(1);
    expect(wrapper.find('Button').length).toEqual(1);

    wrapper.setProps({
      signedIn: true
    });
    wrapper.update();

    ['.paragraph', 'Form', 'Input', 'Button', 'FormGroup', 'Label', 'Button'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(0);
    })

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

})
