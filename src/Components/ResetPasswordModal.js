import React from 'react';
import Modal from 'react-bootstrap/Modal';
import firebase from '../firebase';
import './ResetPasswordModal.css';

export default class ResetPasswordModal extends React.Component {
  passwordReset = (e) => {
    e.preventDefault();
    var auth = firebase.auth();
    const email = document.querySelector('.email-req-input').value;
    auth.sendPasswordResetEmail(email).then(res => {
      return res; 
    })
    .catch(error => {
      console.log(error) 
    });
    this.props.hide();
  };
  
  render() {
    return (
      <Modal {...this.props} id='email-modal'>
        <Modal.Header closeButton onClick={this.props.onHide}>
          <Modal.Title>Please enter your account's email address</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>You will receive an email asking you to follow a link to reset your password.</p>
          <label className="label">Email Address: </label>
          <input name='email-address' placeholder='jane.doe@gmail.com' className='email-req-input' autoFocus={true}></input>          
        </Modal.Body>

        <Modal.Footer>
          <button onClick={this.passwordReset}>Reset Password</button>
        </Modal.Footer>
      </Modal>
    )
  }
}