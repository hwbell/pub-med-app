import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { CSSTransitionGroup } from 'react-transition-group' // ES6

// components
import Header from '../Header';
import ProfileForm from '../ProfileForm';
import OutlinedText from '../OutlinedText';

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
      showProfileForm: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitUser = this.handleSubmitUser.bind(this);
    this.attemptSignIn = this.attemptSignIn.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
    this.toggleEditText = this.toggleEditText.bind(this);
    this.toggleProfileForm = this.toggleProfileForm.bind(this);
  }

  componentDidMount() {
    // console.log(localStorage)
  }

  renderSignIn() {
    return (
      <div className="outline signin" style={{ padding: '40px' }}>
        <p className="paragraph">
          {`Sign in or create an account to start sharing resources with other researchers!`}
        </p>

        <p className="paragraph">
          {`If you don't already have an account, you can sign up by checking the new user box below
          and confirming your password.`}
        </p>

        {this.renderInputs()}
      </div>
    )
  }

  renderInputs() {
    return (
      <Form style={styles.form} onSubmit={this.handleSubmit}>

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

        <Button color="primary" type="submit">sign up!</Button>
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
          <Button className="view article-button" size="sm"
            onMouseOver={this.toggleEditText}
            onMouseLeave={this.toggleEditText}
            onClick={this.toggleProfileForm}>edit profile</Button>

          <Button className="warn article-button" size="sm"
            onClick={this.props.registerSignOut}>logout</Button>

        </div>

        <p className="section-title">
          <strong>{`${this.props.user.name || this.props.user.email}`}</strong>
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
            <p className="profile-title">
              {user.email}
            </p>

            <p className="profile-title">
              {user.collections &&
                `${user.collections.length} collections`}
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
      return console.log('Email and password are required!');
    }

    // check for confirmed password if new user
    if (this.state.checked) {
      if (user.password !== user['confirm-password']) {
        return console.log('passwords dont match, you new user you!')
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

        let { user, token } = response;

        // save info to local storage
        localStorage.setItem(`user`, JSON.stringify(user));
        localStorage.setItem(`token`, JSON.stringify(token));

        // register back in App
        return this.props.registerSignIn(user);

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }

  toggleEditText() {
    this.setState({
      editText: !this.state.editText
    })
  }

  toggleProfileForm() {
    this.setState({
      showProfileForm: !this.state.showProfileForm
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

      }).catch((e) => {
        console.log(e)
        this.setState({
          error: e
        })
      })
  }


  render() {

    // console.log(this.props)
    return (
      <div className="page">

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
            subtitle={""}
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
    flexDirection: 'row'
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
