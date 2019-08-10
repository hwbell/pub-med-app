import React from 'react';
import CollectionPage from './CollectionPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { getArticles } from '../../tools/apiFunctions.js';

const articles = [
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

const modifyStub = jest.fn();

describe('CollectionPage', () => {

  // stubs
  let articles, user, someProps, wrapper;

  beforeEach(async () => {
    user = {
      name: 'Mark',
      email: 'mark@mail.com',
      age: 33,
      collections: [
        {
          name: 'first collection',
          articles: articles
        }
      ],
    };
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
      user,
      modifyCollection: modifyStub
    }

    localStorage.removeItem('collections');
    
    wrapper = shallow(<CollectionPage {...someProps} />);

  });

  // tests
  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await shallow(<CollectionPage {...someProps} />)
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    let wrapper = shallow(<CollectionPage  {...someProps} />);

    ['.page', '.page-content', '.glass'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    });

    ['.collection-block', '.profile-title'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(2);
    });

  });

  it('should render content based on props.collections and props.user.collections', async () => {
    let wrapper = shallow(<CollectionPage  {...someProps} />);

    // there's two to start, one for props.collections and one for user.collections
    expect(wrapper.find('.collection-block').length).toEqual(2);
    expect(wrapper.find('.paragraph').length).toEqual(0);

    // set the props collections to empty 
    wrapper.setProps({
      collections: []
    });
    wrapper.update();

    // now the 1st segment disappears
    expect(wrapper.find('.collection-block').length).toEqual(1);
    expect(wrapper.find('.paragraph').length).toEqual(1);

    user.collections = [];
    wrapper.setProps({
      user
    });

    // // now the 2nd segment disappears
    expect(wrapper.find('.collection-block').length).toEqual(0);
    expect(wrapper.find('.paragraph').length).toEqual(2);
    
  })

  it('should use localStorage collections', () => {
    localStorage.setItem('collections', JSON.stringify(someProps.collections))
    
    someProps.collections = [];
    let wrapper = shallow(<CollectionPage  {...someProps} />);

    // 2 are still rendered, even with no props.collections
    expect(wrapper.find('.collection-block').length).toEqual(2);

  })

  it('should toggle the ArticleViewer', () => {
    let wrapper = shallow(<CollectionPage  {...someProps} />);

    expect(wrapper.state().articleModal).not.toBeTruthy();
    
    wrapper.instance().toggleViewArticle();
    wrapper.update();
    expect(wrapper.state().articleModal).toBeTruthy();

    wrapper.instance().toggleViewArticle();
    wrapper.update();
    expect(wrapper.state().articleModal).not.toBeTruthy();

  })


});

