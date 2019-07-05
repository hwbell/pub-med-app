import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const localStorageMock = require('jest-localstorage-mock');
global.localStorage = localStorageMock;
configure({ adapter: new Adapter() });