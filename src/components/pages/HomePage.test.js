import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './HomePage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// react router context
import { MemoryRouter } from 'react-router-dom';

// mock server functions
jest.mock('../../tools/apiFunctions.js');

// tests
it('renders without crashing', async () => {
  let wrapper = shallow(<HomePage />);
  // wrapper.update();

});

it('renders correctly', async () => {
  const tree = await renderer
    .create(<MemoryRouter>
      <HomePage />
    </MemoryRouter>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains the .page div', () => {
  let wrapper = mount(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>);

  // these are in the header
  expect(wrapper.find('.title').length).toBe(1);
  expect(wrapper.find('.subtitle').length).toBe(1);

  // these are direct children
  expect(wrapper.find('.page').length).toBe(1);
  expect(wrapper.find('.profile-title').length).toBe(4);
  expect(wrapper.find('.glass').length).toEqual(5);
})

it('contains search results after fetch', async () => {
  let wrapper = await shallow(<HomePage />)

  // should be empty to start
  expect(wrapper.state().newPublicationsInfo.paragraph.length).toBe(0)

  // then trigger the fetch
  await wrapper.instance().componentDidMount();

  // unfortunately it seems this is necessary? tried to find alternative, will
  // try again
  // await sleep(DELAY_MS)

  // should have results
  await wrapper.update();
  expect(wrapper.state().newPublicationsInfo.paragraph.length).not.toBe(0)
});

