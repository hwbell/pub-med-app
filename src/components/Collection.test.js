import React from 'react';
import Collection from './Collection';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { getArticles } from '../tools/apiFunctions';

// stubs
let handleDeleteStub = jest.fn();

describe('Collection', () => {

  let someProps;
  let e;
  beforeAll(async () => {
    let articles = await getArticles('medicine').then((response) => {
      return response.resultList.result;
    });

    e = {
      preventDefault: jest.fn()
    }

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

    ['.collection', '.outline', '.results-holder'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    })

    expect(wrapper.find('.collection-title').length).toEqual(1);
    expect(wrapper.find('.fa-edit').length).toEqual(1);

    expect(wrapper.find('.pdf-holder').length).toEqual(0);

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
    expect(wrapper.instance().handleDelete.mock.calls.length).toEqual(1);

  })

  it('should switch between pdf and list view', () => {
    let wrapper = shallow(<Collection {...someProps} />);

    // show the list view initially
    expect(wrapper.find('.results-holder').length).toEqual(1);
    expect(wrapper.find('.pdf-holder').length).toEqual(0);

    // click the 'make pdf' button
    wrapper.find('Button').at(0).simulate('click');
    expect(wrapper.state().showPreview).toEqual(true);

    // should be switched now
    expect(wrapper.find('.results-holder').length).toEqual(0);
    expect(wrapper.find('.pdf-holder').length).toEqual(1);

  })

  it('should toggle the editing boolean', () => {
    let wrapper = shallow(<Collection {...someProps} />);
    expect(wrapper.state().editing).not.toBeTruthy();

    wrapper.find('.fa-edit').simulate('click');
    wrapper.update();
    expect(wrapper.state().editing).toBeTruthy();

  })

  it('should render an input with the collection title when editing', async () => {
    let wrapper = shallow(<Collection {...someProps} />);

    expect(wrapper.find('Form').length).toEqual(0);

    wrapper.instance().toggleEdit();
    expect(wrapper.state().editing).toBeTruthy();
    expect(wrapper.find('Form').length).toEqual(1);
    expect(wrapper.find('Input').length).toEqual(1);

  })

  it("should call focusInput when editing is true", () => {
    const wrapper = shallow(<Collection {...someProps} />)
    const instance = wrapper.instance()
    instance.focusInput = jest.fn()

    instance.toggleEdit()
    // there's a 500ms timeout in the component
    setTimeout(() => {
      expect(instance.focusInput).toBeCalled()
    }, 550)
  })

  it('should create an inputText variable upon handleChange()', () => {
    const wrapper = shallow(<Collection {...someProps} />);
    const instance = wrapper.instance();

    expect(wrapper.state().inputText).toEqual('');
    instance.handleChange('h');
    wrapper.update();
    expect(wrapper.state().inputText).toEqual('h');

  })

  it('should create a collection variable in state upon handleSubmit()', () => {
    const wrapper = shallow(<Collection {...someProps} />);
    const instance = wrapper.instance();
    const e = {
      preventDefault: jest.fn()
    }
    // at first it isnt there
    expect(wrapper.state().tempTitle).toBe(undefined);
    instance.handleChange('collection title');
    wrapper.update();
    instance.handleSubmit(e);
    wrapper.update();
    // but now it should be
    expect(wrapper.state().collection.name).toEqual('collection title');

  })

  it('should show the save option if a collection is modified', () => {
    const wrapper = shallow(<Collection {...someProps} />);
    const instance = wrapper.instance();

    expect(wrapper.find('.fa-save').length).toEqual(0);
    expect(wrapper.find('.fa-undo').length).toEqual(0);

    instance.handleChange('collection title');
    wrapper.setProps({
      isSaved: true
    })
    wrapper.update();
    instance.handleSubmit(e);
    wrapper.update();

    expect(wrapper.find('.fa-save').length).toEqual(1);
    expect(wrapper.find('.fa-undo').length).toEqual(1);

    // 

  })


  // it('should fire the clearEdits() method when the undo icon is clicked', () => {
  //   const wrapper = shallow(<Collection {...someProps} />);    
  //   const instance = wrapper.instance();

  //   // get some changes registered
  //   instance.handleChange('collection title');
  //   wrapper.setProps({
  //     isSaved: true
  //   })
  //   wrapper.update();    
  //   instance.handleSubmit(e);
  //   wrapper.update();

  //   instance.clearEdits = jest.fn()

  //   // click to save
  //   wrapper.find('.fa-undo').simulate('click');
  //   wrapper.update();

  // })

  // it('should toggle the alert modal', () => {
  //   const wrapper = shallow(<Collection {...someProps} />);
  //   const instance = wrapper.instance();

  //   instance.toggleUniqueWarning();
  //   wrapper.update;
  //   expect(wrapper.state().uniqueWarning).toEqual(true);
  // })

})

