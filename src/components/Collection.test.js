import React from 'react';
import Collection from './Collection';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { getArticles } from '../tools/apiFunctions';

// const resizeWindow = (x, y) => {
//   window.innerWidth = x;
//   window.innerHeight = y;
//   window.dispatchEvent(new Event('resize'));
// }

// for setTimeout inside of toggle functions
jest.useFakeTimers()

// stubs
let handleDeleteStub = jest.fn();

// fake user to check local storage functionality
let user = {
  name: 'mark',
  id: '09309jdij3d3d'
}

describe('Collection', () => {

  let e, articles, someProps;

  beforeAll(async () => {
    articles = [
      {
        id: '013091283'
      },
      {
        id: '446264632'
      },
      {
        id: '651753334'
      }
    ]

    e = {
      preventDefault: jest.fn()
    }

    someProps = {
      isSaved: false,
      collection: {
        name: 'sample collection',
        articles
      },
      handleDelete: handleDeleteStub,
    }
  });

  let wrapper, instance;

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(user));
    wrapper = shallow(<Collection {...someProps} />);
    instance = wrapper.instance()
  })

  // tests
  it('renders without crashing', async () => {
    // let wrapper = shallow(<Collection {...someProps} />);
    wrapper.update();

  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<Collection {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {

    ['.collection', '.outline', '.results-holder'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    })

    expect(wrapper.find('Collapse').length).toEqual(1);
    expect(wrapper.find('Fade').length).toEqual(1);
    expect(wrapper.find('AlertModal').length).toEqual(1);

    expect(wrapper.find('.thread-title').length).toEqual(1);
    expect(wrapper.find('.fa-edit').length).toEqual(1);

    expect(wrapper.find('#pdf').length).toEqual(0);

    // if isSaved is false && we have a localStorage user, we will have 4 buttons , i.e. showing save button
    expect(wrapper.find('Button').length).toEqual(4);
    expect(wrapper.find('.fa-angle-double-down').length).toEqual(1);
    expect(wrapper.find('.fa-file-pdf').length).toEqual(1);
    expect(wrapper.find('.fa-save').length).toEqual(1);
    expect(wrapper.find('.fa-trash').length).toEqual(1);

    // the creation date
    expect(wrapper.find('.time').length).toBe(1);

  });

  it('should hide the save button if isSaved=true', () => {
    expect(wrapper.find('.fa-save').length).toEqual(1);

    // change the prop
    wrapper.setProps({
      isSaved: true
    });
    wrapper.update();
    expect(wrapper.find('Button').length).toEqual(3);
    expect(wrapper.find('.fa-save').length).toEqual(0);
  })

  it('should hide the save button if the user is not logged in', () => {
    // change the localStorage
    localStorage.removeItem('user');
    let newWrapper = shallow(<Collection {...someProps} />);

    expect(newWrapper.find('Button').length).toEqual(3);
    expect(newWrapper.find('.fa-save').length).toEqual(0);
  })


  it('should fire the button functions correctly', async () => {

    wrapper.instance().postCollection = jest.fn();
    wrapper.instance().toggleAlertModal = jest.fn();

    // the preview button
    expect(wrapper.state().showPreview).toEqual(false);
    wrapper.find('Button').at(1).simulate('click');
    wrapper.update();
    // theres a 500ms timer on this in the toggle function
    setTimeout(() => {
      expect(wrapper.state().showPreview).toEqual(true);
    }, 600)

    // the save button
    wrapper.find('Button').at(2).simulate('click');
    wrapper.update();
    expect(wrapper.instance().postCollection.mock.calls.length).toEqual(1);

    wrapper.find('Button').at(3).simulate('click');
    wrapper.update();
    expect(wrapper.instance().toggleAlertModal.mock.calls.length).toEqual(1);

  })

  it('should assign values to modalProps depending on isSaved boolean', () => {
    // simulate an new collection
    wrapper.setProps({
      isSaved: false
    });

    // the delete button
    wrapper.find('Button').at(3).simulate('click');
    wrapper.update();

    expect(wrapper.state().modalProps.confirming).toBe(true);
    expect(wrapper.state().modalProps.message).toBe('Are you sure you want to delete this new collection?');

    // simulate a saved collection
    wrapper.setProps({
      isSaved: true
    });
    wrapper.update();

    // the delete button is moved now, since the save button is gone
    wrapper.find('Button').at(2).simulate('click');
    wrapper.update();

    expect(wrapper.state().modalProps.confirming).toBe(true);
    expect(wrapper.state().modalProps.message).toBe('Are you sure you want to delete this saved collection?');

  })

  it('should toggle the pdf document', () => {

    // no pdf initially
    expect(wrapper.find('#pdf').length).toEqual(0);

    // click the 'make pdf' button
    wrapper.find('Button').at(1).simulate('click');

    // account for the 500ms timer on the toggle function
    setTimeout(() => {
      // should be displayed now
      expect(wrapper.state().showPreview).toEqual(true);
      expect(wrapper.find('#pdf').length).toEqual(1);
    }, 600)

    // click the 'make pdf' button again
    wrapper.find('Button').at(1).simulate('click');
    expect(wrapper.state().showPreview).toEqual(false);

    // should be hidden now
    expect(wrapper.find('#pdf').length).toEqual(0);

  })

  it('should close the pdf when the collapse is closed', () => {
    expect(wrapper.find('Collapse').props().isOpen).toBe(false);

    // click the collapse button
    wrapper.find('Button').at(0).simulate('click');

    // should be expanded
    expect(wrapper.find('Collapse').props().isOpen).toBe(true);

    // open the pdf
    wrapper.find('Button').at(1).simulate('click');

    // account for the 500ms timer on the toggle function
    jest.runAllTimers();
    expect(wrapper.find('#pdf').length).toEqual(1);


    // close the collapse 
    wrapper.find('Button').at(0).simulate('click');
    expect(wrapper.find('Collapse').props().isOpen).toBe(false);

    // pdf should be closed now
    expect(wrapper.find('#pdf').length).toEqual(0);

  })

  it('should expand the collapse when pdf button is clicked', () => {
    expect(wrapper.find('Collapse').props().isOpen).toBe(false);
    wrapper.find('Button').at(1).simulate('click');
    expect(wrapper.find('Collapse').props().isOpen).toBe(true);
  })

  it('should toggle the editing boolean', () => {
    expect(wrapper.state().editing).not.toBeTruthy();

    wrapper.find('.fa-edit').simulate('click');
    wrapper.update();
    expect(wrapper.state().editing).toBeTruthy();

  })

  it('should toggle Collapse element holding the collection content', () => {
    expect(wrapper.find('Collapse').props().isOpen).toBe(false);

    wrapper.find('Button').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('Collapse').props().isOpen).toBe(true);
  })

  it('should toggle Fade element holding the popup for the export / save / delete buttons', () => {
    expect(wrapper.find('Fade').props().in).toBe(false);

    let messages = ['make a pdf!', 'save to server', 'delete collection']

    // the mouseOver / mouseLeave events should work with any of the buttons
    wrapper.find('Button').forEach((button, i) => {
      // dont't do the first button, that is the expander
      if (i > 0) {
        wrapper.find('Button').at(i).simulate('mouseOver');
        wrapper.update();
        expect(wrapper.find('Fade').props().in).toBe(true);
        expect(wrapper.find('Fade').render().text()).toBe(messages[i - 1]);
      }
    })

  })

  it('should render an input with the collection title when editing', async () => {

    expect(wrapper.find('Form').length).toEqual(0);

    wrapper.instance().toggleEdit();
    expect(wrapper.state().editing).toBeTruthy();

    expect(wrapper.find('.fa-times-circle').length).toEqual(1);
    expect(wrapper.find('.fa-check-circle').length).toEqual(1);
    expect(wrapper.find('Form').length).toEqual(1);
    expect(wrapper.find('Input').length).toEqual(1);
    expect(wrapper.find('Input').props().value).toEqual(someProps.collection.name);

  })

  it("should call focusInput when editing is true", () => {
    instance.focusInput = jest.fn()

    instance.toggleEdit()
    // there's a 500ms timeout in the component
    setTimeout(() => {
      expect(instance.focusInput).toBeCalled()
    }, 550)
  })

  it('should create an inputText variable upon handleChange()', () => {

    expect(wrapper.state().inputText).toEqual('');
    instance.handleChange('sample collection two');
    wrapper.update();
    expect(wrapper.state().inputText).toEqual('sample collection two');

  })

  it('should create a collection variable in state upon handleSubmit()', () => {
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

  it('should create a collection variable in state upon editSavedCollection()', () => {
    expect(wrapper.state().collection).toBeNull();

    instance.editSavedCollection(articles[0]);
    expect(wrapper.state().collection).not.toBeNull();
  })

  it('should show the save option if a saved collection is modified', () => {

    instance.handleChange('collection title');
    wrapper.setProps({
      isSaved: true
    })
    wrapper.update();

    expect(wrapper.find('.fa-save').length).toEqual(0);
    expect(wrapper.find('.fa-undo').length).toEqual(0);

    instance.handleSubmit(e);
    wrapper.update();

    expect(wrapper.find('.fa-save').length).toEqual(1);
    expect(wrapper.find('.fa-undo').length).toEqual(1);

    // 

  })



  it('should fire the clearEdits() method when the undo icon is clicked', () => {
    const clearEditsSpy = jest.spyOn(Collection.prototype, 'clearEdits');
    const wrapper = shallow(<Collection {...someProps} />);
    const instance = wrapper.instance();

    // this shouldn't be present to start
    expect(wrapper.find('.fa-undo').length).toBe(0);

    // get some changes registered
    instance.handleChange('collection title');
    wrapper.update();
    instance.handleSubmit(e);
    wrapper.update();

    // refresh button appears, click to clearEdits
    expect(wrapper.find('.fa-undo').length).toBe(1);
    wrapper.find('.fa-undo').simulate('click');
    wrapper.update();

    expect(wrapper.state().collection).toBeNull();
    expect(clearEditsSpy).toHaveBeenCalled();

  })

  it('should toggle the alert modal', () => {
    const wrapper = shallow(<Collection {...someProps} />);
    const instance = wrapper.instance();

    expect(wrapper.state().modalProps.isVisible).toEqual(false);

    instance.toggleAlertModal();
    wrapper.update();
    expect(wrapper.state().modalProps.isVisible).toEqual(true);

    instance.toggleAlertModal();
    wrapper.update();
    expect(wrapper.state().modalProps.isVisible).toEqual(false);

  })

  it('should toggle expand / collapse icon', () => {
    const wrapper = shallow(<Collection {...someProps} />);

    // angling up when not expanded
    expect(wrapper.find('.fa-angle-double-down').length).toBe(1);
    expect(wrapper.find('.fa-angle-double-up').length).toBe(0);

    // click the button to switch
    wrapper.find('Button').at(0).simulate('click');
    wrapper.update();

    // angling down when expanded
    expect(wrapper.find('.fa-angle-double-down').length).toBe(0);
    expect(wrapper.find('.fa-angle-double-up').length).toBe(1);
  })

})

