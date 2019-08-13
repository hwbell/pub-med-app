import React from 'react';
import AboutPage from './AboutPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// react router context
import { MemoryRouter } from 'react-router-dom';

describe('AboutPage', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
  })

  // tests
  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<MemoryRouter>
        <AboutPage />
      </MemoryRouter>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    expect(wrapper.find('.page').length).toEqual(1);
    expect(wrapper.find('.page-content').length).toEqual(1);
    expect(wrapper.find('.glass').length).toEqual(1);
    expect(wrapper.find('Header').length).toEqual(1);
    expect(wrapper.find('.outline').length).toEqual(3);
    expect(wrapper.find('.profile-title').length).toEqual(2);
    expect(wrapper.find('.paragraph').length).toEqual(26);

    expect(wrapper.find('AnchorLink').length).toEqual(2);

  });

})
