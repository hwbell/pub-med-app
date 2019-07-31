import React from 'react';

import ThreadPage from './ThreadPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

const refreshUserThreadsStub = jest.fn();

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
  let threads;
  beforeAll(() => {
    threads = [
      {
        name: 'Sourcing of PMID: 013091283',
        article: '013091283'
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
      threads,
      refreshUserThreads: refreshUserThreadsStub
    };
  })

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ThreadPage {...someProps}/>);
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
    expect(wrapper.find('Header').length).toBe(1)

    expect(wrapper.find('Header').props().title).toBe('PMC Threads');
    expect(wrapper.find('Header').props().subtitle).toBe('post a thread to start a discussion');
  })

  it('should contain one <Thread /> for each user thread', () => {

    expect(wrapper.find({color: 'primary'}).length).toBe(1);
    expect(wrapper.find('Thread').length).toBe(3);

  })

  it('should toggle the showThreadForm boolean', () => {

    expect(wrapper.state().showThreadForm).toBe(false);

    wrapper.find({color: 'primary'}).simulate('click');
    wrapper.update();
    expect(wrapper.state().showThreadForm).toBe(true);

    wrapper.find({color: 'primary'}).simulate('click');
    wrapper.update();
    expect(wrapper.state().showThreadForm).toBe(false);

  })

  it('should fire this.props.refreshUserThreads when this.handleSubmitThread is called', () => {

    expect(refreshUserThreadsStub.mock.calls.length).toBe(0);

    wrapper.instance().handleSubmitThread = handleSubmitThreadStub;
    wrapper.instance().handleSubmitThread({
      name: 'Sourcing of PMID: 013091283',
      article: '013091283'
    },)
    wrapper.update();

    expect(refreshUserThreadsStub.mock.calls.length).toBe(1);

  })
})