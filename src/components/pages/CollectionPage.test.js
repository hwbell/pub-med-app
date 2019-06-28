import React from 'react';
import CollectionPage from './CollectionPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { getArticles } from '../../tools/apiFunctions';

describe('CollectionPage', () => {

  // stubs
  const modifyStub = jest.fn();
  let articles;
  let someProps;
  // get some props
  beforeAll(async () => {
    articles = await getArticles('medicine').then((response) => {
      return response.resultList.result;
    });

    someProps = {
      collections: [
        {
          name: 'first collection',
          articles: articles
        },
        {
          name: 'second collection',
          articles: articles
        }
      ],
      modifyCollection: modifyStub
    }
  });

  // tests
  it('renders without crashing', async () => {
    let wrapper = shallow(<CollectionPage {...someProps} />);
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<CollectionPage  {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    let wrapper = shallow(<CollectionPage  {...someProps} />);

    ['.page', '.glass'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    })

    // one .outline div / .article-button for each collection
    expect(wrapper.find('.outline').length).toEqual(someProps.collections.length);
    expect(wrapper.find('.article-button').length).toEqual(someProps.collections.length);
    expect(wrapper.find('.article-button').at(0).html()).toContain('preview');    
  });

  it('should toggle the showPreview Boolean on .article-button click', () => {
    let wrapper = shallow(<CollectionPage  {...someProps} />);

    // it should be false to start
    expect(wrapper.state().showPreview).toEqual(false);

    // register a click and check it is true
    wrapper.find('.article-button').at(0).simulate('click');
    expect(wrapper.state().showPreview).toEqual(true);    

    // flip it back to false
    wrapper.find('.article-button').at(0).simulate('click');
    expect(wrapper.state().showPreview).toEqual(false);    
  })

});

