import React from 'react';
import Collection from './Collection';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { getArticles } from '../tools/apiFunctions';

describe('Collection', () => {

  let someProps;
  beforeAll(async () => {
    let articles = await getArticles('medicine').then((response) => {
      return response.resultList.result;
    });

    someProps = {
      collection: {
        name: 'sample collection',
        articles
      }
    }
  });

  // tests
  it('renders without crashing', async () => {
    let wrapper = shallow(<Collection {...someProps} />);
    // wrapper.update();

  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<Collection {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    let wrapper = shallow(<Collection {...someProps} />);

    expect(wrapper.find('.collection').length).toEqual(1);
    expect(wrapper.find('.outline').length).toEqual(1);
    expect(wrapper.find('Button').length).toEqual(2);


  });

  // it('should post a collection to the server', () => {
  //   let wrapper = shallow(<Collection {...someProps} />);    
    

  // })
})
