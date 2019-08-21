import React from 'react';

import ThreadPage from './ThreadPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// mock server functions
jest.mock('../../tools/serverFunctions.js');

// const user = {
//   name: 'Mark',
//   email: 'mark@example.com',
//   password: 'password'
// }
// const token = '2e8298fgj.23d454543524.2524523542134';

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

// to compare the serverThreads owner prop to the user _id prop.
// the component should filter the user threads out of the server threads
const userId = '98scvy97svh.4r49w8h4s.3dwfw3';
const otherId = '23e8h928f48.298293gf.2dh293';
const serverThreads = [
  {
    name: 'Sourcing of PMID: 013091283',
    article: '013091283',
    owner: otherId
  },
  {
    name: 'Data in figure 1 of PMID: 013091283',
    article: '013091283',
    owner: userId
  },
  {
    name: 'Figure 3 in PMID: 013091283',
    article: '013091283',
    owner: otherId
  }
];

describe('ThreadPage', () => {

  let someProps;
  let user = {};
  beforeAll(() => {
    user = {
      _id: userId,
      threads: [
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
    }
    someProps = {
      serverThreads,
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
    expect(wrapper.find('.outline').length).toBe(1)
    expect(wrapper.find('.add').length).toBe(1);

    expect(wrapper.find('Fade').length).toBe(1)
    expect(wrapper.find('Header').length).toBe(1)

    expect(wrapper.find('Header').props().title).toBe('PMC Threads');
    expect(wrapper.find('Header').props().subtitle).toBe('post a thread to start a discussion');
  })

  it('should contain one <Thread/> for each server thread that is not a user thread', () => {

    // 3 user threads + 2 non-user serverThreads 
    expect(wrapper.find('Thread').length).toBe(5);
  })

  it('should show the correct section titles for user / serverThreads', () => {

    // first, there's only one
    expect(wrapper.find('.section-title').length).toBe(2);
    expect(wrapper.find('.section-title').at(0).text()).toBe('your threads');
    expect(wrapper.find('.section-title').at(1).text()).toBe('recent threads');

    wrapper.setProps({
      serverThreads
    });
    wrapper.update();

    // now another appears with the serverThreads, but serverThreads are on top
    expect(wrapper.find('.section-title').length).toBe(2);
    expect(wrapper.find('.section-title').at(0).text()).toBe('your threads');
    expect(wrapper.find('.section-title').at(1).text()).toBe('recent threads');

  })

  it('should not display the "start new thread" button if there is no user in props', () => {

    // first we have a user so .in will be true 
    expect(wrapper.find('Fade').props().in).toBe(true);

    wrapper.setProps({
      user: null
    });

    // now there is no user, and the fade disappears, .in = false
    wrapper.update();
    expect(wrapper.find('Fade').props().in).toBe(false);
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

  // if there are server collections in props, this is a result of fetching them previously and
  // passing the result back to App, which then provides them as props.
  it('should fire fetchServerThreads() on startup if there are no serverThreads as props', async () => {
    someProps.serverThreads = null;
    const fetchSpy = jest.spyOn(ThreadPage.prototype, 'fetchServerThreads');    
    const newWrapper = shallow(<ThreadPage {...someProps} />);

    // clear it right before
    fetchSpy.mockClear();
    await newWrapper.instance().componentDidMount();

    expect(fetchSpy).toHaveBeenCalled();
  })

  it('should not fire fetchServerThreads() on startup if there are serverThreads as props', async () => {
    someProps.serverThreads = serverThreads;

    const fetchSpy = jest.spyOn(ThreadPage.prototype, 'fetchServerThreads');    
    const newWrapper = mount(<ThreadPage {...someProps} />);

    // // clear it right before
    fetchSpy.mockClear();
    await newWrapper.instance().componentDidMount();

    expect(fetchSpy).not.toHaveBeenCalled();
  })

  it('should not fire fetchServerThreads() on startup if there are serverThreads in localStorage', async () => {
    someProps.serverThreads = null;
    localStorage.setItem('serverThreads', JSON.stringify(serverThreads));

    const fetchSpy = jest.spyOn(ThreadPage.prototype, 'fetchServerThreads');    
    const newWrapper = mount(<ThreadPage {...someProps} />);

    // // clear it right before
    fetchSpy.mockClear();
    await newWrapper.instance().componentDidMount();

    expect(fetchSpy).not.toHaveBeenCalled();
  })

  it('should fire this.props.registerServerTheads() when fetchServerThreads() is fired', async () => {
    registerServerThreadsStub.mockClear();

    await wrapper.instance().fetchServerThreads();
    wrapper.update();

    expect(registerServerThreadsStub.mock.calls.length).toBe(1)
  })

  it('should sort the threads with the localStorage sorter if it exists', () => {
    // it is set to _id inside the component, so set it to something else
    let localSorter = 'commentsCount';

    localStorage.setItem('threadSorter', JSON.stringify(localSorter));
    const newWrapper = mount(<ThreadPage {...someProps} />);

    
  })

})