import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { CSSTransitionGroup } from 'react-transition-group' // ES6

// components
import Header from '../Header';
import ProfileForm from '../ProfileForm';
import OutlinedText from '../OutlinedText';
import AlertModal from '../AlertModal';

import { Button, Form, FormGroup, Label, Input, Fade } from 'reactstrap';

// tools
import { signInUser, patchUser } from '../../tools/serverFunctions';

// ******************************************************************************
class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      editText: false,
      showPopup: false,
      popupMessage: '',
      showProfileForm: false,
      showAlertModal: false,
      loginErrorMessage: 'There was a problem logging :( ... Please try a different name and/or email.',
      showLoginError: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitUser = this.handleSubmitUser.bind(this);
    this.attemptSignIn = this.attemptSignIn.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
    this.toggleAlertModal = this.toggleAlertModal.bind(this);
    this.toggleProfileForm = this.toggleProfileForm.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.attemptSignOut = this.attemptSignOut.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
  }

  componentDidMount() {

    this.setState({
      modalProps: {
        message: `Are you sure you want to sign out? Make sure all your changes are saved!`,
        isVisible: false,
        confirming: false,
        toggle: this.toggleAlertModal
      }
    })
  }

  renderSignIn() {
    return (
      <div className="outline signin" style={{ padding: '40px' }}>

        <p className="thread-title" style={{alignSelf: 'flex-start'}}>Welcome Back</p>
        <p className="paragraph">
          {`Login to your account to connect with other researchers!`}
        </p>

        <p className="thread-title" style={{alignSelf: 'flex-start'}}>Don't have an account?</p>
        <p className="paragraph">
          {`If you don't already have an account, you can sign up by checking the new user box below
          and confirming your password.`}
        </p>

        <p className="thread-title" style={{alignSelf: 'flex-start'}}>Why should I make account?</p>
        <p className="paragraph">
          {`You are welcome to use the site however you like, and we invite you to do so! However, certain
          tools on the site are limited to logged in users, such as saving information to our servers, as well as
          posting and participating in thread discussions. With just an email address and confirmed password, you 
          can access everything the site has to offer! It only takes 10-15 seconds.`}
        </p>


        {this.renderInputs()}
      </div>
    )
  }

  renderInputs() {
    return (
      <Form style={styles.form} onSubmit={this.handleSubmit}>

        <p>Enter your information below</p>

        <Input style={styles.input} type="email" name="email" placeholder="email"
          onChange={(e) => this.handleChange(e)}
        />
        <Input style={styles.input} type="password" name="password" placeholder="password"
          onChange={(e) => this.handleChange(e)}
        />

        <CSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>

          {this.state.checked &&
            <Input key="confirm-password" style={styles.input} type="password" name="confirm-password" placeholder="confirm password"
              onChange={(e) => this.handleChange(e, true)}
            />}

          {this.state.checked &&
            <Input style={styles.input} type="text" name="name" placeholder="username (optional)"
              onChange={(e) => this.handleChange(e)}
            />}


        </CSSTransitionGroup>

        <FormGroup style={{ marginTop: '8px' }} check>
          <Label check>
            <Input type="checkbox" checked={this.state.checked}
              onChange={this.handleCheck} />
            <p>new user?</p>
          </Label>
        </FormGroup>

        <Button color="primary" type="submit">{this.state.checked ? 'sign up!' : 'login'}</Button>
      </Form>
    )
  }

  renderProfile() {

    let user = this.props.user;
    // console.log(user)

    if (!user) {
      return;
    }

    let { about, research, interests, affiliations } = user;

    let userProps = {
      about, research, interests, affiliations
    }

    return (
      <div className="outline profile" style={styles.profileInfo}>

        <div style={styles.buttonHolder}>
          <div className="left-all-row">
            <Button color="link" size="sm"
              style={styles.button}
              onMouseOver={() => this.togglePopup('edit profile')}
              onMouseLeave={() => this.togglePopup('')}
              onClick={this.toggleProfileForm}>
              <i className="fas fa-user-edit"></i>
            </Button>

            <Button color="link" size="sm"
              style={styles.button}
              onMouseOver={() => this.togglePopup('log out')}
              onMouseLeave={() => this.togglePopup('')}
              onClick={this.attemptSignOut}>
              <i className="warn-icon fas fa-sign-out-alt"></i>
            </Button>
          </div>

          <Fade in={this.state.showPopup} style={{ color: 'white', fontSize: '12px', alignSelf: 'flex-end' }}>
            {this.state.popupMessage}
          </Fade>

        </div>

        <p className="profile-title">
          <strong>{`${this.props.user.name || this.props.user.email}`}</strong>
        </p>
        <p className="thread-text">
          {user.email}
        </p>


        {user.collections &&
          <div style={styles.iconRow} className="row">
            {user.collections.map((item, i) => <i key={i} className="fas fa-atom"></i>)}
          </div>}

        {user.threads &&
          <div style={styles.iconRow} className="row">
            {user.threads.map((item, i) => <i key={i} className="fas fa-dna"></i>)}
          </div>}

        <div style={styles.nameAndIcon}>

          <div>
            <p className="thread-text">
              {user.collections &&
                `${user.collections.length} collections`}
            </p>

            <p className="thread-text">
              {user.threads &&
                `${user.threads.length} threads`}
            </p>
          </div>



        </div>

        {Object.keys(userProps).map((prop, i) => {

          let title = prop[0].toUpperCase() + prop.slice(1);
          let text = userProps[prop];

          if (text) {
            return (
              <OutlinedText
                key={i}
                title={title}
                text={text}
                alignLeft={true}
              />
            )
          } else {
            return null
          }

        })}
      </div>
    )
  }

  handleChange(e, confirming) {

    let { name, value } = e.target;

    let obj = this.state.user || {};
    obj[`${name}`] = value;

    this.setState({ user: obj }, () => {
      // console.log(this.state.user)
    })
  }

  handleCheck() {
    this.setState({
      checked: !this.state.checked
    })
  }

  // this one is for the Login Form
  handleSubmit(e) {
    e.preventDefault()
    if (!this.state.user) {
      return;
    }

    // check for all fields, with username being optional
    let user = this.state.user;
    if (!user.email || !user.password) {
      console.log('missing email or password')

      let { modalProps } = this.state;
      modalProps.confirming = false;
      modalProps.confirm = this.toggleAlertModal;
      modalProps.message = 'Email and password are required!'

      this.setState({
        modalProps
      });

      return this.toggleAlertModal();
    }

    // check for confirmed password if new user
    if (this.state.checked) {
      if (user.password !== user['confirm-password']) {
        console.log('passwords dont match, you new user you!')
        let { modalProps } = this.state;
        modalProps.confirming = false;
        modalProps.confirm = this.toggleAlertModal;
        modalProps.message = "Your passwords don't match!"

        this.setState({
          modalProps
        });

        return this.toggleAlertModal();
      }
    }

    console.log(`input looks ok for user: ${user.name}`)

    return this.attemptSignIn(user);
  }

  attemptSignIn(user) {

    // sign the user in via post to the server. get the token and store it for future requests
    // pass this.state.checked as a boolean for whether it is a new user
    return signInUser(user, this.state.checked)
      .then((response) => {
        console.log(response)

        if (response.code === 11000) {
          let { modalProps } = this.state;

          modalProps.message = `Sorry, it looks like that email or name is registered already! Please try another entry`
          modalProps.confirming = false;
          modalProps.confirm = this.toggleAlertModal;

          this.setState({
            modalProps
          }, () => {
            return this.toggleAlertModal();
          })
        }


        let { user, token } = response;

        // save info to local storage
        localStorage.setItem(`user`, JSON.stringify(user));
        localStorage.setItem(`token`, JSON.stringify(token));

        // register back in App
        return this.props.registerSignIn(user);

      }).catch((e) => {
        console.log(e)
        let { modalProps } = this.state;
        modalProps.confirm = this.toggleAlertModal;
        modalProps.message = `It looks like there was a problem signing you in ... please check your information and try again.`
        modalProps.confirming = false;

        this.setState({
          modalProps
        }, () => {
          this.toggleAlertModal();
        })

      })
  }

  // this one is for the Profile Form
  handleSubmitUser(profileInfo) {

    console.log('patching user info')
    if (!profileInfo || Object.keys(profileInfo).length === 0) {
      return;
    }

    // filter out any empty entries
    let patch = {};
    Object.keys(profileInfo).forEach((key) => {
      if (profileInfo[key]) {
        patch[key] = profileInfo[key]
      }
    })

    let token = JSON.parse(localStorage.getItem('token'));
    let headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    // Send the patch to save it to the server. Using the currently stored token
    // will assign the user as the owner of the collection in mongodb on the backend
    return patchUser(patch, headers)
      .then((response) => {
        console.log(response)

        // once we have successfully patched, we will: 

        // 1. Refresh the user - this will send the new collection list sent back
        // from the server to the root App component to update all concerned components
        this.props.refreshUser(response);
        this.toggleProfileForm();

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  // this is for the buttons for signout and edit profile, to explain the icons
  togglePopup(str) {
    if (str) {
      this.setState({
        popupMessage: str,
        showPopup: true
      })
    } else {
      this.setState({
        showPopup: false
      })
    }
  }


  // when the user first clicks sign out icon, popping up the AlertModal
  attemptSignOut() {

    let { modalProps } = this.state;
    modalProps.confirm = this.handleSignout;
    modalProps.message = `Are you sure you want to sign out? Make sure you saved any changes!`
    modalProps.confirming = true;

    this.setState({
      modalProps
    }, () => {
      this.toggleAlertModal();
    })
  }

  // when the signout is confirmed
  handleSignout() {
    let { modalProps } = this.state;
    modalProps.isVisible = !modalProps.isVisible;

    this.setState({
      modalProps
    }, () => {
      this.props.registerSignOut();
    })
  }

  toggleAlertModal() {
    let { modalProps } = this.state;
    modalProps.isVisible = !modalProps.isVisible;

    this.setState({
      modalProps
    })
  }

  toggleProfileForm() {
    this.setState({
      showProfileForm: !this.state.showProfileForm
    })
  }


  render() {

    // console.log(this.props)
    return (
      <div className="page">

        {/* the warning for signing out */}
        <AlertModal {...this.state.modalProps} />

        {/* the edit modal, for user that is logged in */}
        <ProfileForm
          isVisible={this.state.showProfileForm}
          user={this.props.user}
          toggle={this.toggleProfileForm}
          handleSubmitUser={this.handleSubmitUser}
        />

        <div className="glass page-content">

          <Header
            class="heading"
            title={"Your Profile"}
            subtitle={"say something about you"}
          />

          {!this.props.user ?
            this.renderSignIn() :
            this.renderProfile()
          }

        </div>

      </div>
    );
  }
}

const styles = {
  form: {
    width: '80%',
    maxWidth: '300px',
    margin: 0,
    padding: 0,
  },
  input: {
    margin: 0,
    marginTop: '8px'
  },
  buttonHolder: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    fontSize: '16px'
  },
  iconRow: {
    paddingLeft: '24px'
  },
  profileInfo: {
    padding: '20px',
    alignItems: 'flex-start'
  },
  nameAndIcon: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}

export default ProfilePage;
