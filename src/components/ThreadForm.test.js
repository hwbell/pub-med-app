import React from 'react';
import ThreadForm from './ThreadForm';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// functions
import { combineObjects } from '../tools/objectFunctions';

// stub for toggling
const toggleStub = jest.fn();
const handleSubmitThreadStub = jest.fn();
const handleChangeStub = jest.fn();

const thread = {
  name: 'Sourcing of PMID: 013091283',
  _id: '488ut3t',
  article: '013091283',
  user: 'The Creator',
  paragraph: 'I found the source material for the basis of this study to be lacking. Does anyone else agree?',
}

const userId = '2893dffrbv8.f4308fhv34.4308fg343';

describe('ThreadForm', () => {

  let wrapper, instance, someProps;

  beforeEach(() => {
    someProps = {
      user: {
        _id: userId
      },
      thread,
      headerText: 'A text Header',
      isVisible: false,
      toggle: toggleStub,
      handleSubmitThread: handleSubmitThreadStub,
      handleChange: handleChangeStub,
      showUniqueWarning: false
    };
    wrapper = shallow(<ThreadForm {...someProps} />)
    instance = wrapper.instance();
  })

  // tests
  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<ThreadForm />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {

    ['Modal', 'ModalBody', 'ModalHeader', 'ModalFooter', 'Form', '.add', '.back'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    });

    expect(wrapper.find('ModalHeader').render().text()).toBe(someProps.headerText)
    expect(wrapper.find('Fade').length).toBe(1);

    // one input for each property of the thread
    expect(wrapper.find('Input').length).toBe(3);

  });

  it('should not show the ModalHeader if this.props.headerText is falsy', () => {
    
    wrapper.setProps({
      headerText: ''
    });
    wrapper.update();

    expect(wrapper.find('ModalHeader').length).toBe(0);
  })

  it('should have the correct placeholder values without this.props.thread', () => {
    wrapper.setProps({
      thread: null
    })
    expect(wrapper.find('Input').at(0).props().placeholder).toBe("Give your post a clear, searchable name!");
    expect(wrapper.find('Input').at(1).props().placeholder).toBe("Include the PMID or PMCID of related articles.")
    expect(wrapper.find('Input').at(2).props().placeholder).toBe("Give a short description of the topic of your thread.")

  })

  it('should use values from this.props.thread if there is not threadInfo in state', () => {
    expect(wrapper.find('Input').at(0).props().value).toBe(thread.name);
    expect(wrapper.find('Input').at(1).props().value).toBe(thread.article)
    expect(wrapper.find('Input').at(2).props().value).toBe(thread.paragraph)
  })

  it('should have an empty threadInfo in state to start', () => {
    expect(wrapper.state().threadInfo).toMatchObject({})
  })

  it('should save threadInfo in state when user types in info', () => {
    let e = {
      target: {
        name: 'about',
        paragraph: 'This article seemed unreliable, but upon futher reading ... '
      }
    }
    wrapper.instance().handleChange(e)
    wrapper.update();

    expect(wrapper.state().threadInfo).toMatchObject({
      about: e.paragraph
    })
  })

  it('should fire the provided handleSubmitThread() function when OK is clicked', () => {
    wrapper.setProps({
      thread
    });
    wrapper.update();

    let e = {
      target: {
        name: 'about',
        paragraph: 'This article seemed unreliable, but upon futher reading ... '
      }
    }
    wrapper.instance().handleChange(e)
    wrapper.update();

    wrapper.find('.add').simulate('click');
    wrapper.update();

    // inside the component, the info should be combined when submitting

    let { threadInfo } = wrapper.state();

    let combinedInfo = combineObjects(threadInfo, thread, Object.keys(thread));
    combinedInfo.owner = userId;

    expect(handleSubmitThreadStub.mock.calls.length).toBe(1)
    expect(handleSubmitThreadStub).toBeCalledWith(combinedInfo)
  })

  it('should fire the provided toggle when the cancel button is clicked', () => {

    wrapper.find('.back').simulate('click');
    expect(toggleStub.mock.calls.length).toBe(1);

  })

  it('should show the Fade element when this.props.showUniqueWarning === true', () => {

    expect(wrapper.find('Fade').props().in).toBe(false);

    wrapper.setProps({
      showUniqueWarning: true
    });
    wrapper.update();

    expect(wrapper.find('Fade').props().in).toBe(true);

  })

})