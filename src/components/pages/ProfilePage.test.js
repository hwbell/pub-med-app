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
    });

    expect(wrapper.find('AlertModal').length).toBe(1);

  });

  it('shows the signin form if user is not signed in', () => {
    
    wrapper.update();
    expect(wrapper.find('.profile').length).toEqual(1);
    expect(wrapper.find('.signin').length).toEqual(0);
    expect(wrapper.find('.profile-title').length).toEqual(1);
    expect(wrapper.find('.thread-text').length).toEqual(3);

    expect(wrapper.find('Button').length).toEqual(2);    
    expect(wrapper.find('.fa-user-edit').length).toEqual(1);    
    expect(wrapper.find('.fa-sign-out-alt').length).toEqual(1);    

    expect(wrapper.find('Fade').length).toBe(1);

    // change the signedIn prop and wipe the user
    wrapper.setProps({ user: null });
    wrapper.update();
    // check for the change
    expect(wrapper.find('.profile').length).toEqual(0);
    expect(wrapper.find('.signin').length).toEqual(1);
    expect(wrapper.find('.profile-title').length).toEqual(0);
    expect(wrapper.find('Button').at(0).render().text()).toEqual('sign up!');
    expect(wrapper.find('Fade').length).toBe(0);
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

  it('toggleAlertModal() should toggle the AlertModal', async () => {
    let wrapper = await mount(<ProfilePage />);

    expect(wrapper.state().modalProps.isVisible).toBe(false);
    expect(wrapper.find('AlertModal').props().isVisible).toBe(false);

    wrapper.instance().toggleAlertModal();
    wrapper.update();

    expect(wrapper.state().modalProps.isVisible).toBe(true);   
    expect(wrapper.find('AlertModal').props().isVisible).toBe(true);

    wrapper.instance().toggleAlertModal();
    wrapper.update();

    expect(wrapper.state().modalProps.isVisible).toBe(false);   
    expect(wrapper.find('AlertModal').props().isVisible).toBe(false);

    
  })

  it('togglePopup should assign this.state.popupText and toggle the boolean for the Fade', () => {
    expect(wrapper.state().showPopup).toBe(false);
    expect(wrapper.find('Fade').props().in).toBe(false);
    expect(wrapper.find('Fade').render().text()).toBe('');

    wrapper.instance().togglePopup('fade text');
    wrapper.update();

    expect(wrapper.find('Fade').props().in).toBe(true);
    expect(wrapper.find('Fade').render().text()).toBe('fade text');
    expect(wrapper.state().showPopup).toBe(true);
    
  })

  it('should show the Fade text when the edit / logout buttons are hovered', async () => {
    // mount to check inner props of the Fade
    let wrapper = await mount(<ProfilePage {...someProps}/>);
    
    // start not showing the fade
    expect(wrapper.state().showPopup).toBe(false);    
    expect(wrapper.find('Fade').props().in).toBe(false);

    // toggles when the user hovers on the edit button
    wrapper.find('.fa-user-edit').simulate('mouseover');
    wrapper.update();
    
    expect(wrapper.state().showPopup).toBe(true);
    expect(wrapper.find('Fade').props().in).toBe(true);
    expect(wrapper.find('Fade').render().text()).toBe('edit profile');

     // toggles when the user hovers on the logout button
     wrapper.find('.fa-sign-out-alt').simulate('mouseover');
     wrapper.update();
     
     expect(wrapper.state().showPopup).toBe(true);
     expect(wrapper.find('Fade').props().in).toBe(true);
     expect(wrapper.find('Fade').render().text()).toBe('log out');

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
