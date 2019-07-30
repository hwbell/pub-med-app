import React from 'react';
import CollectionPage from './CollectionPage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { getArticles } from '../../tools/apiFunctions.js';

describe('CollectionPage', () => {

  // stubs
  const modifyStub = jest.fn();
  let articles;
  let someProps;
  // get some props
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
      user: {
        name: 'Mark',
        email: 'mark@mail.com',
        age: 33,
        collections: [
          {
            name: 'first collection',
            articles: articles
          }
        ],
      },
      modifyCollection: modifyStub
    }
  });

  // tests
  it('renders without crashing', async () => {
    let wrapper = shallow(<CollectionPage {...someProps} />);
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

    ['.collection-block', '.section-title'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(2);
    });


  });

  it('should change content when collections are empty', () => {
    let wrapper = shallow(<CollectionPage  {...someProps} />);

    // the explanations should not appear with collections present 
    expect(wrapper.find('.outline').length).toEqual(1);
    expect(wrapper.find('.section-title').length).toEqual(2);

    // set the user's collections to empty 
    wrapper.setProps({
      user: {
        name: 'Mark',
        email: 'mark@mail.com',
        age: 33,
        collections: []
      }
    });

    // now the 1st segment appears
    expect(wrapper.find('.paragraph').length).toEqual(1);

    //  set the new collections to empty 
    wrapper.setProps({
      collections: []
    });

    // now the second segment appears
    expect(wrapper.find('.paragraph').length).toEqual(2);

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

