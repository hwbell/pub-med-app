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

const newThread = {
  name: 'Figure 5 in PMID: 83470572093',
  article: '83470572093'
}

describe('ProfilePage', () => {
  
  let articles;
  let threads;
  let collections;
  let someProps;

  beforeAll( async () => {
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

    threads = [
      {
        name: 'Sourcing of PMID: 013091283',
        article: '013091283'
      },
      {
        name: 'Data in figure 1 of PMID: 013091283',
        article: '013091283'
      },
      {
        name: 'Figure 3 in PMID: 013091283',
        article: '013091283'
      }
    ]

    collections = [
      {
        name: 'first collection',
        articles: articles
      },
      {
        name: 'second collection',
        articles: articles
      }
    ]

    someProps = {
      user: {
        name: 'Mark',
        email: 'mark@mail.com',
        age: 33,
        threads,
        collections
      }
    }
  }) 

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ProfilePage {...someProps}/>);
  })

  // tests
  it('renders without crashing', async () => {
    wrapper.update();

  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(<ProfilePage />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements', () => {
    let wrapper = mount(<ProfilePage />);

    ['.page', '.page-content', '.glass', '.heading', '.outline', 'Button'].forEach((selector) => {
      expect(wrapper.find(selector).length).toEqual(1);
    })

  });

  it('shows the signin form if user is not signed in', () => {
    
    wrapper.update();
    expect(wrapper.find('.profile').length).toEqual(1);
    expect(wrapper.find('.signin').length).toEqual(0);
    expect(wrapper.find('.profile-title').length).toEqual(2);
    expect(wrapper.find('.section-title').length).toEqual(1);
    expect(wrapper.find('Button').length).toEqual(2);    
    expect(wrapper.find('Button').at(0).render().text()).toEqual('edit profile');
    expect(wrapper.find('Button').at(1).render().text()).toEqual('logout');

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
    // let wrapper = shallow(<ProfilePage {...someProps}/>);

    expect(wrapper.state().editText).toBe(false);

    wrapper.instance().toggleEditText();
    wrapper.update();

    expect(wrapper.state().editText).toBe(true);    
    
  })

  it('toggles the ProfileForm modal when the edit icon is clicked', () => {

    expect(wrapper.state().showProfileForm).toBe(false);
    
    wrapper.instance().toggleProfileForm();
    wrapper.update();
    expect(wrapper.state().showProfileForm).toBe(true);

    wrapper.instance().toggleProfileForm();    
    wrapper.update();
    expect(wrapper.state().showProfileForm).toBe(false);

  })

  it('should show atom icons representing the number of user collections', () => {

    // we gave the user 2 collections
    expect(wrapper.find('.fa-atom').length).toBe(2);

    // add another collection
    let user = someProps.user;
    user.collections.push(articles[0]);
    wrapper.setProps({user});
    wrapper.update();
   
    expect(wrapper.find('.fa-atom').length).toBe(3);

  })

  it('should show dna icons representing the number of user threads', () => {

    // we gave the user 3 threads
    expect(wrapper.find('.fa-dna').length).toBe(3);

    // add another thread
    let user = someProps.user;
    user.threads.push(newThread);
    wrapper.setProps({user});
    wrapper.update();
   
    expect(wrapper.find('.fa-dna').length).toBe(4);
  })
  

})
