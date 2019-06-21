import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

it('renders without crashing', async () => {
  let wrapper = await shallow(<App />);
  // wrapper.update();
  
});

// something needs fixing with pose here ... FIX IT!
// it('renders correctly', async () => {
  // const tree = await renderer
    // .create(<App/>)
    // .toJSON();
  // expect(tree).toMatchSnapshot();
// });
