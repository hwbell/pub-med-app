import React from 'react';
import SearchPage from './SearchPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

jest.mock('../../tools/apiFunctions');

describe('SearchPage', () => {

  // stubs
  const modifyStub = jest.fn();
  const createNewStub = jest.fn();

  let wrapper, someProps;
  beforeEach(async () => {
    someProps = {
      collections: [],
      modifyCollection: modifyStub,
      createNewCollection: createNewStub
    };
    wrapper = shallow(<SearchPage {...someProps} />)

    localStorage.removeItem('searchResults');
  });

  // tests
  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<SearchPage  {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    let newWrapper = shallow(<SearchPage {...someProps} />);

    ['.page', '.page-content', '.glass', '.outline', '#loader', 'Form', '.left-all-row'].forEach((selector) => {
      expect(newWrapper.find(selector).length).toEqual(1);
    })
    expect(wrapper.find('.article-button').length).toBe(1);

    // sorters
    expect(newWrapper.find('.sort-link').length).toBe(4);
    expect(newWrapper.find('.sort-link').at(0).render().text()).toBe('1st author');
    expect(newWrapper.find('.sort-link').at(1).render().text()).toBe('date');
    expect(newWrapper.find('.sort-link').at(2).render().text()).toBe('cited');
    expect(newWrapper.find('.sort-link').at(3).render().text()).toBe('relevance');

  });

  it('should initially have no search results until componentDidMount has completed', async () => {

    const fetchSpy = jest.spyOn(SearchPage.prototype, 'fetchSearch');
    const newWrapper = shallow(<SearchPage {...someProps} />);

    // to start the results should be null
    expect(newWrapper.state().results).toEqual(null);

    // fire a search and check that results are > 0
    await newWrapper.instance().componentDidMount();
    // fetchSearch was called
    expect(fetchSpy).toHaveBeenCalled();

    expect(newWrapper.state().results[0]).toMatchObject(
      {
        title: 'Article 1',
        pmid: 'PMID100001'
      },
    );
    expect(newWrapper.state().results[35]).toMatchObject(
      {
        title: 'Article 36',
        pmid: 'PMID1000036'
      },
    );
  })

  it('should show more results when the "show more" button is clicked', async () => {
    
    await wrapper.instance().componentDidMount();

    // there's up to 50 results
    expect(wrapper.find('ArticleResult').length).toBe(50);

    // the collapse shows the first 10 until expanded
    expect(wrapper.find('Collapse').length).toBe(1);
    expect(wrapper.state().showMoreResults).toBe(false);
    expect(wrapper.find('Collapse').props().isOpen).toBe(false);

    wrapper.find('.article-button').simulate('click');
    wrapper.update();
    expect(wrapper.find('Collapse').props().isOpen).toBe(true);

  })

  it('should switch the showLoading boolean to false after componentDidMount and upon search completion', async () => {
    let newWrapper = shallow(<SearchPage {...someProps} />);

    // check that showLoading is initally true
    expect(newWrapper.state().showLoading).toEqual(true);


    // try awaiting and make sure it is set to false upon completion
    await newWrapper.instance().componentDidMount(); // fetch called in here
    newWrapper.update();
    expect(newWrapper.state().showLoading).toEqual(false);
  })

  it('should change this.state.query when the user types something into the input', () => {

    expect(wrapper.state().query).toBe('neuron');
    wrapper.instance().handleChange('science');
    wrapper.update();

    expect(wrapper.state().query).toBe('science');
  })

  it('should change this.state.sorter and fire new search when sort buttons are clicked', () => {
    const fetchSpy = jest.spyOn(SearchPage.prototype, 'fetchSearch');
    const newWrapper = shallow(<SearchPage {...someProps} />);

    // default sorter is date unless changed by the user 
    expect(newWrapper.state().sorter).toBe('');

    // click the cited button
    newWrapper.find('.sort-link').at(0).simulate('click');
    expect(newWrapper.state().sorter).toBe('AUTH_FIRST');
    // should call the fetch again
    expect(fetchSpy).toHaveBeenCalledWith('neuron', 'AUTH_FIRST');

    // click the date button
    newWrapper.find('.sort-link').at(1).simulate('click');
    expect(newWrapper.state().sorter).toBe('P_PDATE_D');
    // should call the fetch again
    expect(fetchSpy).toHaveBeenCalledWith('neuron', 'P_PDATE_D');

    // click the relevance button
    newWrapper.find('.sort-link').at(2).simulate('click');
    expect(newWrapper.state().sorter).toBe('CITED');
    // should call the fetch again
    expect(fetchSpy).toHaveBeenCalledWith('neuron', 'CITED');

    newWrapper.find('.sort-link').at(3).simulate('click');
    expect(newWrapper.state().sorter).toBe('');
    // should call the fetch again
    expect(fetchSpy).toHaveBeenCalledWith('neuron', '');


  })

});

