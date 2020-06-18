import React from 'react';
import Form from 'react-bootstrap/Form'
import './Login.css';
import arrow from '../images/dark-triangle.png'
import fbLogin from '../images/fb-logo.png'
import googleLogin from '../images/google-logo.png'
import firebase from '../firebase'
import ResetPasswordModal from './ResetPasswordModal';

export default class Login extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      forgotPassword : false,
      verifyModalShow: false,
    }
  }
  
  handleEmailLogin = () => {
    const email = document.querySelector('.email-input').value;
    const password = document.querySelector('.password-input').value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      this.props.userAuthed();
    })
    .catch(error => {
      var errorCode = error.code;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong username or password.');
      }
      console.log(error);
    });
  };

  forgotPass = () => {
    this.setState({forgotPassword : true})
  };

  closeModal = () => {
    this.setState({forgotPassword: false})
  }

	enterBtn = (e) => {
		if (e.keyCode === 13) {
			this.handleEmailLogin()
		}
	}

	render() {
		return (
				<div className="login-modal">
					<header className="login-header">
						<h2 className="login-switch">Login</h2>
						<h2 className="create-switch" onClick={this.props.createAccountToggle}>Create Account</h2>
						<img src={arrow} alt="indicator arrow" />
					</header>

          <div className="login-title-block">
            <h2>Make Gift Registries</h2>
            <h4>Share them with your friends and family!</h4>
          </div>

          <div className="login-form-block" onKeyUp={this.enterBtn}>
              <Form>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Email/Username" className="email-input"></Form.Control>
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" className='password-input'></Form.Control>
                </Form.Group>
              </Form>
              <button className="forgot-username" onClick={this.forgotPass}>Forgot Password?</button>
              {this.state.forgotPassword ? <ResetPasswordModal show={this.state.forgotPassword} onHide={this.closeModal}/> : null}
          </div>

          <div className="login-button-block">
            <button type="button" name="button" onClick={this.handleEmailLogin}>Login</button>
          </div>

          <div className="or">OR</div>

          <div className="social-media-block">
            <button><img src={googleLogin} alt="Login with Google" onClick={this.props.google}/></button>
            <button><img src={fbLogin} alt="Login with Facebook" onClick={this.props.facebook}/></button>
          </div>

        </div>
    );
  };
};