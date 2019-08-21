import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import ImageUploader from './ImageUploader';

describe('ImageUploader', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ImageUploader />);
  })

  it('renders without crashing', async () => {
    wrapper.update();
  });
  
  it('renders correctly', async () => {
    const tree = await renderer
      .create(<ImageUploader />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it('contains the correct elements', () => {
    expect(wrapper.find('.upload-container').length).toBe(1);
    expect(wrapper.find('.form-control').length).toBe(1);
    expect(wrapper.find('Fade').length).toBe(1);
    expect(wrapper.find('Button').length).toBe(1);

    expect(wrapper.find('Fade').props().in).toBe(false);

  })

  it('should fire the this.onChange() when the user selects a file', () => {
    const onChangeSpy = jest.spyOn(ImageUploader.prototype, 'onChangeHandler');        
    let newWrapper = shallow(<ImageUploader />);

    newWrapper.find('.form-control').simulate('change');

    expect(onChangeSpy).toHaveBeenCalled();
  })
})
