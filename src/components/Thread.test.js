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
      article: '013091283',
      user: 'The Creator',
      paragraph: 'I found the source material for the basis of this study to be lacking. Does anyone else agree?',
      comments: [
        {
          text: 'This article seems to lack source material for the conclusions drawn in the discussion.',
          user: 'Jeff'
        },
        {
          text: 'Does anyone else find figure 5 really confusing?',
          user: 'mark'
        }

      ],

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
    wrapper = shallow(<Thread {...someProps}/>);
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<Thread  {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    expect(wrapper.find('.outline').length).toBe(1)

    expect(wrapper.find('.profile-title').length).toBe(1)
    expect(wrapper.find('.paragraph').length).toBe(3)

    // these three cover information that we would always have - the name, article, and user
    expect(wrapper.find('.profile-title').text()).toBe(thread.name);
    expect(wrapper.find('.paragraph').at(0).text()).toBe(thread.article);
    expect(wrapper.find('.paragraph').at(1).text()).toBe(thread.user);

    // this one we may or may not have
    expect(wrapper.find('.paragraph').at(2).text()).toBe(thread.paragraph);

  })


})