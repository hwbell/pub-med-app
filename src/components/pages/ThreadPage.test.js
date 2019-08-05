import React from 'react';

import ThreadPage from './ThreadPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// mock server functions
jest.mock('../../tools/serverFunctions.js');

const user = {
  name: 'Mark',
  email: 'mark@example.com',
  password: 'password'
}
const token = '2e8298fgj.23d454543524.2524523542134';

const registerServerThreadsStub = jest.fn();
const fetchServerThreadsStub = jest.fn();

const refreshUserThreadsStub = jest.fn();
const renderThreadsStub = jest.fn();
const refreshServerThreadsStub = jest.fn();

const handleSubmitThreadStub = (threadInfo) => {
  return new Promise((resolve, reject) => {

    if (!threadInfo || Object.keys(threadInfo).length === 0) {
      reject('invalid input');
    } else {
      resolve(refreshUserThreadsStub());
    }
  });
}

describe('ThreadPage', () => {

  let someProps;
  let user = {};
  beforeAll(() => {
    user.threads = [
      {
        name: 'Sourcing of PMID: 013091283',
        article: '013091283',

      },
      {
        name: 'Data in figure 1 of PMID: 013091283',
        article: '013091283'
      },
      {
        name: 'Figure 3 in PMID: 013091283',
        article: '013091283'
      }
    ]
    someProps = {
      user,
      refreshUserThreads: refreshUserThreadsStub,
      refreshServerThreads: refreshServerThreadsStub,
      registerServerThreads: registerServerThreadsStub
    };
  })

  let wrapper;
  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = shallow(<ThreadPage {...someProps} />);
  })

  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<ThreadPage  {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    expect(wrapper.find('.page-content').length).toBe(1)
    expect(wrapper.find('.glass').length).toBe(1)
    expect(wrapper.find('.add').length).toBe(1);

    expect(wrapper.find('Header').length).toBe(1)

    expect(wrapper.find('Header').props().title).toBe('PMC Threads');
    expect(wrapper.find('Header').props().subtitle).toBe('post a thread to start a discussion');
  })

  it('should contain one <Thread /> for each user thread', () => {
    expect(wrapper.find('Thread').length).toBe(3);
  })

  it('should containe one <Thread/> for each server thread', () => {
    wrapper.setProps({
      serverThreads: user.threads
    });
    // now there is an additional 3
    wrapper.update();
    expect(wrapper.find('Thread').length).toBe(6);
  })

  it('should show the correct section titles for user / serverThreads', () => {
    
    // first, there's only one
    expect(wrapper.find('.section-title').length).toBe(1);
    expect(wrapper.find('.section-title').text()).toBe('your threads');
    
    wrapper.setProps({
      serverThreads: user.threads
    });
    wrapper.update();

    // now another appears with the serverThreads, but serverThreads are on top
    expect(wrapper.find('.section-title').length).toBe(2);
    expect(wrapper.find('.section-title').at(0).text()).toBe('your threads');
    expect(wrapper.find('.section-title').at(1).text()).toBe('recent threads');

  })

  it('should toggle the showThreadForm boolean', () => {

    expect(wrapper.state().showThreadForm).toBe(false);

    wrapper.find('.add').simulate('click');
    wrapper.update();
    expect(wrapper.state().showThreadForm).toBe(true);

    wrapper.find('.add').simulate('click');
    wrapper.update();
    expect(wrapper.state().showThreadForm).toBe(false);

  })

  it('should toggle the showUniqueWarning boolean', () => {

    expect(wrapper.state().showUniqueWarning).toBe(false);

    wrapper.instance().toggleUniqueWarning();
    wrapper.update();
    expect(wrapper.state().showUniqueWarning).toBe(true);
    // 
    wrapper.instance().toggleUniqueWarning();
    wrapper.update();
    expect(wrapper.state().showUniqueWarning).toBe(false);

  })

  it('should fire this.props.refreshUserThreads when this.handleSubmitThread is called', () => {

    expect(refreshUserThreadsStub.mock.calls.length).toBe(0);

    wrapper.instance().handleSubmitThread = handleSubmitThreadStub;
    wrapper.instance().handleSubmitThread({
      name: 'Sourcing of PMID: 013091283',
      article: '013091283'
    })
    wrapper.update();

    expect(refreshUserThreadsStub.mock.calls.length).toBe(1);

  })

  it('should not render Threads if there are no user threads', () => {
    someProps.user.threads = null;

    const newWrapper = shallow(<ThreadPage {...someProps} />);
    newWrapper.instance().renderThreads = renderThreadsStub;

    expect(newWrapper.find('Thread').length).toBe(0);

  })

  // if there are server collections in props, this is a result of fetching them previously and
  // passing the result back to App, which then provides them as props.
  it('should fire fetchServerThreads() on startup if there are no serverThreads as props', async () => {

    
    someProps.serverThreads = null;

    const newWrapper = shallow(<ThreadPage {...someProps} />);

    let fetchServerThreadsStub = jest.fn();
    newWrapper.instance().fetchServerThreads = fetchServerThreadsStub;
    newWrapper.instance().componentDidMount();

    expect(fetchServerThreadsStub.mock.calls.length).toBe(1)
  })

  it('should not fire fetchServerThreads() on startup if there are serverThreads as props', async () => {

    someProps.serverThreads = user.threads;
    const newWrapper = shallow(<ThreadPage {...someProps} />);

    newWrapper.instance().fetchServerThreads = fetchServerThreadsStub;

    wrapper.update();

    expect(fetchServerThreadsStub.mock.calls.length).toBe(0)
  })

  it('should fire this.props.registerServerTheads() when fetchServerThreads() is fired', async () => {
    registerServerThreadsStub.mockClear();
    
    await wrapper.instance().fetchServerThreads();
    wrapper.update();

    expect(registerServerThreadsStub.mock.calls.length).toBe(1)
  })
})