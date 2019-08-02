import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const localStorageMock = require('jest-localstorage-mock');
global.localStorage = localStorageMock;

global.matchMedia = media => ({
  addListener: () => { },
  removeListener: () => { },
  matches: media === '(min-width: 545px)',
});

configure({ adapter: new Adapter() });
