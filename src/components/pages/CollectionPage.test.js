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
    const tree = await renderer
      .create(<CollectionPage  {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    let wrapper = shallow(<CollectionPage  {...someProps} />);

    ['.page', '.glass'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    });

    ['.collection-block', '.subtitle'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(2);
    });


  });

  it('should change content when collections are empty', () => {
    let wrapper = shallow(<CollectionPage  {...someProps} />);

    // the explanations should not appear with collections present 
    ['.outline', '.paragraph'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(0);
    });

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
    ['.outline', '.paragraph'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    });

    //  set the new collections to empty 
    wrapper.setProps({
      collections: []
    });

    // now the second segment appears
    ['.outline', '.paragraph'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(2);
    });

  })

});

