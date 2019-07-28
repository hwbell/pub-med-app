import React from 'react';
import ReactDOM from 'react-dom';
import Navigator from './Navigator';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

it('renders without crashing', async () => {
  let wrapper = mount(<Navigator />);
});

it('renders correctly', async () => {
  const tree = await renderer
    .create(<Navigator/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains the correct elements', () => {
  let wrapper = shallow( <Navigator/>);

  expect(wrapper.find('.links-holder').length).toEqual(1);
  expect(wrapper.find('.nav-link').length).toEqual(4);

})