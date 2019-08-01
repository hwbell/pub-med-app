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

    expect(wrapper.find('.thread-title').length).toBe(1)
    expect(wrapper.find('.thread-text').length).toBe(2)
    expect(wrapper.find('.view').length).toBe(1)
    expect(wrapper.find('Fade').length).toBe(1)

    // these three cover information that we would always have - the name, article, and user
    expect(wrapper.find('.thread-title').text()).toBe(thread.name);

    expect(wrapper.find('.thread-text').at(0).text()).toBe(`  ${thread.user}`);

    // this one we may or may not have
    let paragraph = thread.paragraph.slice(0,50);
    expect(wrapper.find('.thread-text').at(1).text()).toBe(paragraph + ` ...`);

  })

  it('should toggle the comment form', () => {
    expect(wrapper.state().showCommentForm).toBe(false);

    wrapper.instance().toggleCommentForm();
    wrapper.update();

    expect(wrapper.state().showCommentForm).toBe(true);
    
    wrapper.instance().toggleCommentForm();
    wrapper.update();

    expect(wrapper.state().showCommentForm).toBe(false);
  })

  it('should change hide the comment button when it is clicked', () => {
    wrapper.find('.view').simulate('click');
    wrapper.update();

    expect(wrapper.state().showCommentForm).toBe(true);
    expect(wrapper.find('Fade').props().in).toBe(false);
  })

  it('should change / hide the Collapse holding CommentForm when the comment button it is clicked', () => {

    expect(wrapper.find('Collapse').props().isOpen).toBe(false);

    wrapper.find('.view').simulate('click');
    wrapper.update();

    expect(wrapper.state().showCommentForm).toBe(true);
    expect(wrapper.find('Collapse').props().isOpen).toBe(true);
  })

  it('should show how many comments a thread has', () => {
    expect(wrapper.find('.thread-detail').length).toBe(1);
  })
})