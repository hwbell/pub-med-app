import React from 'react';
import ThreadForm from './ThreadForm';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// stub for toggling
const toggleStub = jest.fn();
const handleSubmitThreadStub = jest.fn();
const handleChangeStub = jest.fn();

const thread = {
  name: 'Sourcing of PMID: 013091283',
  article: '013091283',
  user: 'The Creator',
  paragraph: 'I found the source material for the basis of this study to be lacking. Does anyone else agree?',
}
const someProps = {
  thread,
  isVisible: false,
  toggle: toggleStub,
  handleSubmitThread: handleSubmitThreadStub,
  handleChange: handleChangeStub
}

describe('ThreadForm', () => {

  let wrapper, instance;

  beforeEach(() => {
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

    ['Modal', 'ModalBody', 'ModalFooter', 'Form',{ color: "primary" }, { color: "primary" }].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    });

    // one input for each property of the thread
    expect(wrapper.find('Input').length).toBe(3);

  });

  it('should have the correct placeholder values', () => {
    expect(wrapper.find('Input').at(0).props().placeholder).toBe("Give your post a clear, searchable name!");
    expect(wrapper.find('Input').at(1).props().placeholder).toBe("Include the PMID or PMCID of related articles.")
    expect(wrapper.find('Input').at(2).props().placeholder).toBe("Give a short description of the topic of your thread.")

  })

  it('should use values from this.props.user if there is not threadInfo in state', () => {
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

  it('should fire the provided handleSumbitThread() function when OK is clicked', () => {

    wrapper.find({color: 'primary'}).simulate('click');
    wrapper.update();

    expect(handleSubmitThreadStub.mock.calls.length).toBe(1)
    expect(handleSubmitThreadStub).toBeCalledWith(wrapper.state().threadInfo)
  })

  it('should fire the provided toggle when the cancel button is clicked', () => {

    wrapper.find({ color: "secondary" }).simulate('click');
    expect(toggleStub.mock.calls.length).toBe(1);

  })

})