import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './HomePage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// tools
import { getArticles, parseSearchToTitlesArray } from '../../tools/apiFunctions';

const DELAY_MS = 2000

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// tests
it('renders without crashing', async () => {
  let wrapper = shallow(<HomePage />);
  // wrapper.update();

});

it('renders correctly', async () => {
  const tree = await renderer
    .create(<HomePage />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains the .page div', () => {
  let wrapper = shallow(<HomePage />);
  expect(wrapper.html()).toContain('div class=\"page\"')
});

it('contains Header elements', async () => {
  let wrapper = mount(<HomePage />);
  expect(wrapper.html()).toContain('h2 class=\"title\"');
  expect(wrapper.html()).toContain('h4 class=\"subtitle\"');
})

// this also tests that the TextBlock elements are getting rendered
it('contains .glass elements', async () => {
  let wrapper = mount(<HomePage />);
  expect(wrapper.find('.glass').length).toEqual(5);
})

it('contains search results after fetch', async () => {
  let wrapper = await shallow(<HomePage />)

  // should be empty to start
  expect(wrapper.state().newPublicationsInfo.paragraph.length).toBe(0)

  // then trigger the fetch
  await wrapper.instance().fetchArticles();
  
  // unfortunately it seems this is necessary? tried to find alternative, will
  // try again
  // await sleep(DELAY_MS)
  
  // should have results
  await wrapper.update();
  expect(wrapper.state().newPublicationsInfo.paragraph.length).not.toBe(0)
});

