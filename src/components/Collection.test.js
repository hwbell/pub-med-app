import React from 'react';
import Collection from './Collection';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { getArticles } from '../tools/apiFunctions';

// stubs
let handleDeleteStub = jest.fn();
let toggleStub = jest.fn();
let previewStub = jest.fn();

describe('Collection', () => {

  let someProps;
  beforeAll(async () => {
    let articles = await getArticles('medicine').then((response) => {
      return response.resultList.result;
    });

    someProps = {
      collection: {
        name: 'sample collection',
        articles
      },
      handleDelete: handleDeleteStub,
    }
  });

  // tests
  it('renders without crashing', async () => {
    let wrapper = shallow(<Collection {...someProps} />);
    // wrapper.update();

  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<Collection {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    let wrapper = shallow(<Collection {...someProps} />);

    expect(wrapper.find('.collection').length).toEqual(1);
    expect(wrapper.find('.outline').length).toEqual(1);

    // if unspecified, we will have 3 buttons
    expect(wrapper.find('Button').length).toEqual(3);
    expect(wrapper.find('Button').at(0).render().text()).toEqual('make pdf');
    expect(wrapper.find('Button').at(1).render().text()).toEqual('save to my collections');
    expect(wrapper.find('Button').at(2).render().text()).toEqual('delete');


    // if we set the isSaved boolean=true, we should't see the save button
    wrapper.setProps({
      isSaved: true
    });
    expect(wrapper.find('Button').length).toEqual(2);


  });

  it('should fire the button functions correctly', async () => {
    let wrapper = shallow(<Collection {...someProps} />);

    wrapper.instance().postCollection = jest.fn();
    wrapper.instance().handleDelete = jest.fn();
    
    // the preview button
    expect(wrapper.state().showPreview).toEqual(false);
    wrapper.find('Button').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.state().showPreview).toEqual(true);    

    // the save button
    wrapper.find('Button').at(1).simulate('click');
    wrapper.update();
    expect(wrapper.instance().postCollection.mock.calls.length).toEqual(1);

    // the delete button
    wrapper.find('Button').at(2).simulate('click');
    wrapper.update();
    expect(handleDeleteStub.mock.calls.length).toEqual(1);

  })

  it('should switch between pdf and list view', () => {
    let wrapper = shallow(<Collection {...someProps} />);
  
    wrapper.find('Button').at(0).simulate('click');
    expect(wrapper.state().showPreview).toEqual(true);
  
  })

})

