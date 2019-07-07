import React from 'react';
import AlertModal from './AlertModal';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

const toggleStub = jest.fn();

describe('AlertModal', () => {

  let someProps;
  let wrapper, instance;
  beforeAll(async () => {
    someProps = {
      message: 'Hey! You have to provide a unique name!',
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
  })

})

