import React from 'react';
import AboutPage from './AboutPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// tests
it('renders without crashing', async () => {
  let wrapper = shallow(<AboutPage />);
  // wrapper.update();

});

it('renders correctly', async () => {
  const tree = await renderer
    .create(<AboutPage />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains the corect elements', () => {
  let wrapper = mount(<AboutPage />);
  expect(wrapper.find('.page').length).toEqual(1);
  expect(wrapper.find('.glass').length).toEqual(1);

});
