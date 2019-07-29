import React from 'react';
import ProfileForm from './ProfileForm';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// stub for toggling
const toggleStub = jest.fn();
const handleSubmitUserStub = jest.fn();
const handleChangeStub = jest.fn();

const someProps = {
  isVisible: false,
  toggle: toggleStub,
  handleSubmitUser: handleSubmitUserStub,
  handleChange: handleChangeStub
}

describe('ProfileForm', () => {

  let wrapper, instance;

  beforeEach(() => {
    wrapper = shallow(<ProfileForm {...someProps} />)
    instance = wrapper.instance();
  })

  // tests
  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<ProfileForm />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {

    ['Modal', 'ModalBody', 'ModalFooter', 'Form',{ color: "primary" }, { color: "primary" }].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    });

    expect(wrapper.find('Input').length).toBe(4);
    expect(wrapper.find('Input').at(0).props().placeholder).toBe("Say something about yourself!");
    expect(wrapper.find('Input').at(1).props().placeholder).toBe("What is your area of expertise?")
    expect(wrapper.find('Input').at(2).props().placeholder).toBe("Where do you conduct your research?")
    expect(wrapper.find('Input').at(3).props().placeholder).toBe("What are your interests outside of research?")


  });

  it('should have an empty profileInfo in state to start', () => { 
    expect(wrapper.state().profileInfo).toMatchObject({})
  })

  it('should save profileInfo in state when user types in info', () => { 
    let e = {
      target: {
        name: 'about',
        value: 'My name is mark!'
      }
    }
    wrapper.instance().handleChange(e)
    wrapper.update();

    expect(wrapper.state().profileInfo).toMatchObject({
      about: 'My name is mark!'
    })
  })

  it('should fire the provided handleSumbitUser() function when OK is clicked', () => {

    wrapper.find({color: 'primary'}).simulate('click');
    wrapper.update();

    expect(handleSubmitUserStub.mock.calls.length).toBe(1)
    expect(handleSubmitUserStub).toBeCalledWith(wrapper.state().profileInfo)
  })

  it('should fire the provided toggle when the cancel button is clicked', () => {

    wrapper.find({ color: "secondary" }).simulate('click');
    expect(toggleStub.mock.calls.length).toBe(1);

  })

})