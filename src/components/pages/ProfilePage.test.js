import React from 'react';
import ProfilePage from './ProfilePage';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { getArticles } from '../../tools/apiFunctions.js';

// sample props
const user = {
  name: 'Harry',
  email: 'harry@example.com'
};

describe('ProfilePage', () => {
  let articles;
  let someProps;
  beforeAll( async () => {
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
      }
    }
  }) 
  // tests
  it('renders without crashing', async () => {
    let wrapper = shallow(<ProfilePage />);
    // wrapper.update();

  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<ProfilePage />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    let wrapper = mount(<ProfilePage />);

    ['.page', '.glass', '.heading', '.outline', 'Button'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    })

  });

  it('shows the signin form if user is not signed in', () => {
    let wrapper = shallow(<ProfilePage {...someProps}/>);
    
    wrapper.update();
    expect(wrapper.find('.profile').length).toEqual(1);
    expect(wrapper.find('.signin').length).toEqual(0);
    expect(wrapper.find('.profile-title').length).toEqual(4);
    expect(wrapper.find('.fa-user-edit').length).toEqual(1);    
    expect(wrapper.find('Button').at(0).render().text()).toEqual('logout');

    // change the signedIn prop and wipe the user
    wrapper.setProps({ user: null });
    wrapper.update();
    // check for the change
    expect(wrapper.find('.profile').length).toEqual(0);
    expect(wrapper.find('.signin').length).toEqual(1);
    expect(wrapper.find('.profile-title').length).toEqual(0);
    expect(wrapper.find('Button').at(0).render().text()).toEqual('sign up!');


  })

  it('should show the users profile once signed in', async () => {
    let wrapper = mount(<ProfilePage />);

    // at first, no profile
    expect(wrapper.find('.profile').length).toEqual(0);

    // change the state and check for its appearance. need to supply
    // a user as well

    wrapper.setProps({ signedIn: true });
    wrapper.setProps({ user });

    wrapper.update();
    expect(wrapper.find('.profile').length).toEqual(1);
  })

  it('handleCheck() should toggle the checkbox', () => {
    let wrapper = mount(<ProfilePage />);
    expect(wrapper.state().checked).toBe(false);
    expect(wrapper.find('Input').length).toEqual(3);

    // check it
    wrapper.instance().handleCheck();
    wrapper.update();
    expect(wrapper.state().checked).toBe(true);
    expect(wrapper.find('Input').length).toEqual(5);

    // uncheck it
    wrapper.instance().handleCheck();
    wrapper.update();
    expect(wrapper.state().checked).toBe(false);
    // wait for the css transition out
    setTimeout(() => {
      expect(wrapper.find('Input').length).toEqual(3);
    }, 500)

  })

  it('toggleEditText() should toggle the edit text', () => {
    let wrapper = shallow(<ProfilePage {...someProps}/>);

    wrapper.update();
    expect(wrapper.state().editText).toBe(false);
    expect(wrapper.find('.profile-title').length).toEqual(4);

    wrapper.instance().toggleEditText();
    wrapper.update();

    // now state is changed and there's another profile-title, the icon
    expect(wrapper.state().editText).toBe(true);    
    expect(wrapper.find('.profile-title').length).toEqual(5);
    expect(wrapper.find('.fa-user-edit').length).toEqual(1);
    
  })

  

})
