import React from 'react';

import CommentForm from './CommentForm';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

const confirmStub = jest.fn();
const toggleStub = jest.fn();

const someProps = {
  confirm: confirmStub,
  toggle: toggleStub
};

describe('CommentForm', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<CommentForm {...someProps} />)
  })

  it('renders without crashing', () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<CommentForm  {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    expect(wrapper.find('Input').length).toBe(1);
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('.add').length).toBe(1);
    expect(wrapper.find('.back').length).toBe(1);
  })

  it('should change the value of this.state.comment when handleChange() is called', () => {
    let e = {
      target: {
        value: 'This is a comment!'
      }
    }

    wrapper.instance().handleChange(e);
    wrapper.update();
    expect(wrapper.state().comment.text).toBe(e.target.value)
  })

  it('should fire this.handleSubmit() and this.props.confirm() when post thread button is clicked', () => {
    jest.clearAllMocks();

    wrapper.find('.add').simulate('click');
    wrapper.update();


    expect(toggleStub.mock.calls.length).toBe(1);

    // without a comment it shouldn't be called
    expect(confirmStub.mock.calls.length).toBe(0);

    // provide a comment 
    wrapper.setState({
      comment: { text: 'Yo dude!' }
    });
    wrapper.find('.add').simulate('click');
    wrapper.update();
    expect(confirmStub.mock.calls.length).toBe(1);

  })

  it('should fire this.props.toggle() when the cancel button is clicked', () => {

  })
})