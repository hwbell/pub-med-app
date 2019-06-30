import React from 'react';
import SearchPage from './SearchPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { getArticles } from '../../tools/apiFunctions';

describe('SearchPage', () => {

  // stubs
  const modifyStub = jest.fn();
  const createNewStub = jest.fn();

  // let articles;
  let someProps;

  // get some props
  beforeAll(async () => {
    // articles = await getArticles('medicine').then((response) => {
    // return response.resultList.result;
    // });

    someProps = {
      collections: [],
      modifyCollection: modifyStub,
      createNewCollection: createNewStub
    }
  });

  // tests
  it('renders without crashing', async () => {
    let wrapper = shallow(<SearchPage {...someProps} />);
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<SearchPage  {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    let wrapper = shallow(<SearchPage  {...someProps} />);

    ['.page', '.glass', '.outline', '#loader', 'Form'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    })

  });

  it('should initially have no search results until componentDidMount has completed', async () => {
    let wrapper = shallow(<SearchPage  {...someProps} />);
    expect(wrapper.state().results).toEqual(null);

    // fire a search and check that results are > 0
    await wrapper.instance().componentDidMount();
    expect(wrapper.state().results.length).toBeGreaterThan(0);
    
  })

  it('should switch the showLoading boolean to false after componentDidMount and upon search completion', async () => {
    let wrapper = shallow(<SearchPage  {...someProps} />);

    // check that showLoading is initally true
    expect(wrapper.state().showLoading).toEqual(true);

    // fire submit but don't await, will only switch boolean to true 
    wrapper.find('Form').simulate('submit', {
      preventDefault: () => {}
    });
    wrapper.update();
    expect(wrapper.state().showLoading).toEqual(true);

    // try awaiting and make sure it is set to false upon completion
    await wrapper.instance().componentDidMount(); // fetch called in here
    wrapper.update();
    expect(wrapper.state().showLoading).toEqual(false);
  })
});

