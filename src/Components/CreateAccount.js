import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import './CreateAccount.css';
import arrow from '../images/dark-triangle.png';
import fbLogin from '../images/fb-logo.png';
import googleLogin from '../images/google-logo.png';
import firebase from '../firebase.js'
export default class CreateAccount extends React.Component {
  SubmitBtnDisengaged = () => {
    let firstName = document.getElementsByClassName("first-input")[0].value;
    let lastName = document.getElementsByClassName("last-input")[0].value;
    if (firstName && lastName) {
      this.checkpassword();
    } else {
      alert("Error, name fields must be filled out");
    }
  }

  newEmailUser = () => {
    const email = document.querySelector('.email-input').value;
    const password = document.querySelector('.password-input').value;
    const firstNameInput = document.querySelector('#firstNameForm').value;
    const lastNameInput = document.querySelector('#lastNameForm').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      //This is adding the user an an object into the database as a node
      .then(function () {
        const id = firebase.auth().currentUser.uid;
        const user = {
          name: `${firstNameInput} ${lastNameInput}`,
          email: email,
          sharedWithMe: [],
        };
        firebase.database().ref('users').child(id).set(user);
      })
      .then(function () {
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function () {
          console.log("Verified")
        }).catch(function (error) {
          console.log(error);
        });
      })
      //This is adding the name information into the authorization data
      .then(function () {
        var user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: `${firstNameInput} ${lastNameInput}`
        }).then(function () {
          console.log('Update Successful')
        }).catch(function (error) {
          console.log(error)
        });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }

  checkpassword = () => {
    let password1 = document.getElementsByClassName("password-input")[0].value;
    let password2 = document.getElementsByClassName("password-confirm-input")[0].value;
    if (password1 === "" || password2 === "") {
      alert("Error, both password fields must be filled in.");
    } else if (password1 === password2) {
      this.newEmailUser();
    } else {
      alert("Error, password fields must match, please try again.");
    }
  }

  enterBtn = (e) => {
    if (e.keyCode === 13) {
      this.SubmitBtnDisengaged();
    }
  }

  render() {
    return (
      <div className="signup-modal">
        <header className="signup-header">
          <h2 className="login-switch" onClick={this.props.loginToggle}>Login</h2>
          <h2 className="create-switch">Create Account</h2>
          <img src={arrow} alt="indicator arrow" />
        </header>

        <div className="signup-title-block">
          <h2>Make Gift Registeries</h2>
          <h4 className="title-center">Share them with your friends and family!</h4>
        </div>

        <Form id="registration-form" className="signup-form-block" onKeyUp={this.enterBtn}>
          <Form.Row>
            <Col>
              <Form.Group controlId="firstNameForm">
                <Form.Label>First Name:</Form.Label>
                <Form.Control type="fistName" placeholder="Jane" className='first-input' required={true} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="lastNameForm">
                <Form.Label>Last Name:</Form.Label>
                <Form.Control required type="lastName" placeholder="Doe" className='last-input' />
              </Form.Group>
            </Col>
          </Form.Row>

          <Form.Group controlId="emailForm">
            <Form.Label>Email Address:</Form.Label>
            <Form.Control required type="email" placeholder="jane.doe@gmail.com" className='email-input' />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
							</Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" placeholder="Password" className='password-input' required />
          </Form.Group>
          <Form.Group controlId="checkPassword">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control type="password" placeholder="Password" className='password-confirm-input' required />
          </Form.Group>
        </Form>
        <div className="signup-button-block">
          <button type="button" name="button" onClick={this.SubmitBtnDisengaged} className="create" src="/login">Create Account</button>
        </div>
        <div className="or">Or</div>
        <div className="social-media-block">
          <button><img src={googleLogin} alt="Create an account with Google" onClick={this.props.google} /></button>
          <button><img src={fbLogin} alt="Create an account with Facebook" onClick={this.props.facebook} /></button>
        </div>
      </div>
    );
  };
};