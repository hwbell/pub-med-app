import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

it('renders without crashing', async () => {
  let wrapper = mount(<Header />);
});

it('renders correctly', async () => {
  const tree = await renderer
    .create(<Header/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains the correct elements', () => {
  let wrapper = shallow( <Header/>);
  expect(wrapper.find('.glass').length).toEqual(1);
  expect(wrapper.find('.title').length).toEqual(1);
  expect(wrapper.find('.subtitle').length).toEqual(1);

})