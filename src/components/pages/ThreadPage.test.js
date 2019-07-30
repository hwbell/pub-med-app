import React from 'react';

import ThreadPage from './ThreadPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

describe('ThreadPage', () => {

  let someProps;
  let threads;
  beforeAll(() => {
    threads = [
      {
        name: 'Sourcing of PMID: 013091283',
        article: '013091283'
      },
      {
        name: 'Data in figure 1 of PMID: 013091283',
        article: '013091283'
      },
      {
        name: 'Figure 3 in PMID: 013091283',
        article: '013091283'
      }
    ]
    someProps = {
      threads
    };
  })

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ThreadPage {...someProps}/>);
  })

  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<ThreadPage  {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    expect(wrapper.find('.page-content').length).toBe(1)
    expect(wrapper.find('.glass').length).toBe(1)
    expect(wrapper.find('Header').length).toBe(1)

    expect(wrapper.find('Header').props().title).toBe('PMC Threads');
    expect(wrapper.find('Header').props().subtitle).toBe('post a thread to start a discussion');
  })

  it('should contain one <Thread /> for each user thread', () => {
    expect(wrapper.find('Thread').length).toBe(3);

  })

})