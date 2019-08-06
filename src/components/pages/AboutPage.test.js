import React from 'react';
import AboutPage from './AboutPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';


describe('AboutPage', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<AboutPage />);
  })

  // tests
  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<AboutPage />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the corect elements', () => {
    expect(wrapper.find('.page').length).toEqual(1);
    expect(wrapper.find('.page-content').length).toEqual(1);
    expect(wrapper.find('.glass').length).toEqual(1);
    expect(wrapper.find('Header').length).toEqual(1);

  });

})
