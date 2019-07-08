import React from 'react';
import AlertModal from './AlertModal';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

const toggleStub = jest.fn();
const confirmStub = jest.fn();

describe('AlertModal', () => {

  let someProps;
  let wrapper, instance;
  beforeAll(async () => {
    someProps = {
      message: 'Hey! You have to provide a unique name!',
      confirm: confirmStub,
      toggle: toggleStub,
      isVisible: false
    }
  });

  beforeEach( () => {
    wrapper = shallow(<AlertModal {...someProps} />)
    instance = wrapper.instance();
  })

  // tests
  it('renders without crashing', async () => {
    let wrapper = shallow(<AlertModal {...someProps}/>);
    // wrapper.update();

  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<AlertModal {...someProps}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the correct elements', () => {
    ['Modal', 'ModalBody', 'ModalFooter', {color: "primary"}].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    })

    expect(wrapper.find('Button').length).toEqual(1);

    // two buttons if this.props.confirming === true
    wrapper.setProps({
      confirming: true
    });
    expect(wrapper.find('Button').length).toEqual(2);
  })

  it('fires the correct functions for confirm and cancel', () => {

    wrapper.find('Button').at(0).simulate('click');
    wrapper.update();
    expect(confirmStub.mock.calls.length).toEqual(1);

    wrapper.setProps({
      confirming: true
    })
    wrapper.update();

    wrapper.find('Button').at(1).simulate('click');
    wrapper.update();
    expect(toggleStub.mock.calls.length).toEqual(1);
    
  })


})

