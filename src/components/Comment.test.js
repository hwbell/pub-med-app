import React from 'react';

import Comment from './Comment';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

const someProps = {
  comment: {
    text: 'This article seems to lack source material for the conclusions drawn in the discussion.',
    user: 'Jeff'
  }
};

describe('Comment', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Comment { ...someProps}/>)
  })

  it('renders without crashing', () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<Comment  {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    expect(wrapper.find('.comment').length).toBe(1);
    expect(wrapper.find('.profile-title').length).toBe(1);
    expect(wrapper.find('.paragraph').length).toBe(1);
    expect(wrapper.find('hr').length).toBe(1);
  })

})