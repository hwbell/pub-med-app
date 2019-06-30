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

  }

  componentDidMount() {
    // console.log(localStorage)
  }

  renderSignIn() {
    return (
      <div className="outline" style={{ padding: '20px' }}>
        <p className="paragraph">
          {`Create an account to start sharing resources with other researchers!`}
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

        <Input style={styles.input} type="text" name="name" placeholder="username"
          onChange={(e) => this.handleChange(e)}
        />
        <Input style={styles.input} type="email" name="email" placeholder="email"
          onChange={(e) => this.handleChange(e)}
        />
        <Input style={styles.input} type="password" name="password" placeholder="password"
          onChange={(e) => this.handleChange(e)}
        />

        {/* {this.state.checked &&
          <Input style={styles.input} type="password" name="confirm-password" placeholder="confirm password"
            onChange={(e) => this.handleChange(e)}
          />} */}


        <CSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {this.state.checked &&
            <Input key="confirm-password" style={styles.input} type="password" name="confirm-password" placeholder="confirm password"
              onChange={(e) => this.handleChange(e, true)}
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
    return (
      <div>Your Name</div>
    )
  }

  handleChange(e, confirming) {

    let { name, value } = e.target;

    let obj = this.state.user || {};
    obj[`${name}`] = value;

    this.setState({user: obj}, () => {
      console.log(this.state.user)
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

    // check for all fields
    let user = this.state.user;
    let keys = Object.keys(user);
    keys.forEach((key) => {
      if (!user[key]) {
        return alert('Username, email, and password are required!')
      }
    })

    // check for matching passwords if new user
    if (this.state.checked) {
      if(user.password !== user['confirm-password']) {
        return console.log('passwords dont match, you new user you!')
      }
    }

    console.log('input looks ok')
  }

  attemptSignIn() {

    // get the results from the api
    return signInUser()
      .then((response) => {
        // console.log(response.resultList.result)
        // let articleTitles = parseSearchToTitlesArray(results);
        this.setState({
          results: response.resultList.result,
          showLoading: false
          // articleTitles
        })
      }).catch((e) => {
        // console.log(e)
        this.setState({
          error: e
        })
      })
  }

  render() {

    return (
      <div className="page">

        <div className="glass">

          <Header
            class="heading"
            title={this.props.username || "Your Profile"}
            subtitle={""}
          />

          {!this.props.signedIn ?
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
