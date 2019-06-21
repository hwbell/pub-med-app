import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './HomePage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

it('renders without crashing', async () => {
  let wrapper = shallow(<HomePage />);
  // wrapper.update();
  
});

it('renders correctly', async () => {
  const tree = await renderer
    .create(<HomePage/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains the .page div', () => {
  let wrapper = shallow( <HomePage/>);
  expect(wrapper.html()).toContain('div class=\"page\"')
})