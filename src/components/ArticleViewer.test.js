import React from 'react';
import ArticleViewer from './ArticleViewer';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { getArticles } from '../tools/apiFunctions';

// stubs
// let handleDeleteStub = jest.fn();
// let toggleStub = jest.fn();
// let previewStub = jest.fn();

describe('ArticleViewer', () => {

  let someProps;
  beforeAll(async () => {
    let articles = await getArticles('medicine').then((response) => {
      return response.resultList.result;
    });

    someProps = {
      article: articles[0],
      // handleDelete: handleDeleteStub,
    }
  });

  // tests
  it('renders without crashing', async () => {
    let wrapper = shallow(<ArticleViewer {...someProps}/>);
    // wrapper.update();

  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<ArticleViewer {...someProps}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

})

