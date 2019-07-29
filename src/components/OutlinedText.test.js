import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import OutlinedText from './OutlinedText';

describe('OutlinedText', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<OutlinedText />);
  })

  it('renders without crashing', async () => {
    wrapper.update();
  });
  
  it('renders correctly', async () => {
    const tree = await renderer
      .create(<OutlinedText />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it('contains the correct elements', () => {
    expect(wrapper.find('.outline').length).toBe(1);
    expect(wrapper.find('.paragraph').length).toBe(1);
  })

  it('should not show a title unless provided', () => {
    // without title prop there wont be a profile-title
    expect(wrapper.find('.profile-title').length).toBe(0);

    // once a title is provided it should show up
    wrapper.setProps({title: 'About'});
    wrapper.update();
    expect(wrapper.find('.profile-title').length).toBe(1);

  })

  it('should align items with alignLeft prop if provided', () => {
    // set a title so we can check this as well as the paragraph
    wrapper.setProps({title: 'About'});

    expect(wrapper.find('.profile-title').props().style.alignSelf).toBe('');
    expect(wrapper.find('.paragraph').props().style.alignSelf).toBe('');

    // set the prop
    wrapper.setProps({
      alignLeft: true
    });

    expect(wrapper.find('.profile-title').props().style.alignSelf).toBe('flex-start');
    expect(wrapper.find('.paragraph').props().style.alignSelf).toBe('flex-start');
  })
})
