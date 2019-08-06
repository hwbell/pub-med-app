import React from 'react';

import Thread from './Thread';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// stubs
const toggleThreadFormStub = jest.fn();

describe('Thread', () => {

  let someProps;
  let thread;
  let wrapper;

  beforeEach(() => {
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
      commentsCount: 2
    }
    someProps = {
      user: {
        name: 'mark',
        _id: '9898y23e23ee20389u'
      },
      thread,
      toggleThreadForm: toggleThreadFormStub
    };

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
    expect(wrapper.find('.thread-text').length).toBe(3)
    expect(wrapper.find('.view').length).toBe(1)
    expect(wrapper.find('Fade').length).toBe(1)
    expect(wrapper.find('AlertModal').length).toBe(1);

    // these three cover information that we would always have - the name, article, and user
    expect(wrapper.find('.thread-title').text()).toBe(thread.name);

    expect(wrapper.find('.thread-text').at(0).text()).toBe(`  ${thread.user}`);

    // this one we may or may not have
    let paragraph = thread.paragraph.slice(0,50);
    expect(wrapper.find('.thread-text').at(1).text()).toBe(paragraph + ` ...`);

  })

  it('should not display the comment button if there is no user in props', () => {
    wrapper.setProps({
      user: null
    });
    wrapper.update();

    expect(wrapper.find('.view').length).toBe(0);
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

  it('should render delete + edit buttons if its a user-owned thread', () => {
    expect(wrapper.find('.fa-edit').length).toBe(0);
    expect(wrapper.find('.fa-trash-alt').length).toBe(0);

    wrapper.setProps({
      allowEdit: true
    });

    wrapper.update();

    expect(wrapper.find('.fa-edit').length).toBe(1);
    expect(wrapper.find('.fa-trash-alt').length).toBe(1);
  })

  it('should toggle the showDeleteWarning boolean when the trash icon is clicked', () => {
    // get the buttons in there
    wrapper.setProps({
      allowEdit: true
    });
    wrapper.update();

    expect(wrapper.state().showDeleteWarning).toBe(false);

    wrapper.find('.fa-trash-alt').simulate('click');
    wrapper.update();

    expect(wrapper.state().showDeleteWarning).toBe(true);
  })

  it('should show how many comments a thread has', () => {
    expect(wrapper.find('Comment').length).toBe(2);

    expect(wrapper.find('.thread-text').at(2).text()).toBe(`${thread.commentsCount} comments`)
  })

  it('should toggle the ThreadForm when the edit button is clicked', () => {
    jest.clearAllMocks();

    // get the buttons in there
    wrapper.setProps({
      allowEdit: true
    });
    wrapper.update();
    
    wrapper.find('.fa-edit').simulate('click');

    expect(toggleThreadFormStub.mock.calls.length).toBe(1)
  
  })


})