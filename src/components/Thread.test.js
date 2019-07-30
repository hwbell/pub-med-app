import React from 'react';

import Thread from './Thread';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

describe('Thread', () => {

  let someProps;
  let thread;
  beforeAll(() => {
    thread = {
      name: 'Sourcing of PMID: 013091283',
      article: '013091283'
    }
    someProps = {
      thread
    };
  })

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Thread {...someProps}/>);
  })

  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<Thread  {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    expect(wrapper.find('.outline').length).toBe(1)
  })

  it('should contain one <Thread /> for each user thread', () => {
    // expect(wrapper.find('Thread').length).toBe(3);

  })

})