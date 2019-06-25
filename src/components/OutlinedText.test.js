import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import OutlinedText from './OutlinedText';

it('renders without crashing', async () => {
  let wrapper = mount(<OutlinedText />);
});

it('renders correctly', async () => {
  const tree = await renderer
    .create(<OutlinedText />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains the correct elements', () => {
  let wrapper = shallow( <OutlinedText />);
  expect(wrapper.html()).toContain('div class=\"outline\"');
  expect(wrapper.html()).toContain('p class=\"paragraph\"');
})