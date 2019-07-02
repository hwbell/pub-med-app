import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { CSSTransitionGroup } from 'react-transition-group' // ES6

// components
import Header from '../Header';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

// tools
import { signInUser } from '../../tools/serverFunctions';

// ******************************************************************************
class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.attemptSignIn = this.attemptSignIn.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
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

    if (!user) {
      return;
    }

    return (
      <div className="outline profile" style={{ padding: '20px' }}>
        <p className="article-title">
          {`Signed in as: ${this.props.user.name || this.props.user.email}`}
        </p>

        <p className="paragraph">
          {user.email}
        </p>

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
    }, () => {
      console.log(this.state.checked)
    })
  }

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

  render() {

    // console.log(this.props)
    return (
      <div className="page">

        <div className="glass">

          <Header
            class="heading"
            title={this.props.username || "Your Profile"}
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
  }
}

export default ProfilePage;
