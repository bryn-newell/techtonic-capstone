import React from 'react';
import Modal from 'react-bootstrap/Modal';
import firebase from '../firebase';
import './VerifyEmailModal.css';

export default class VerifyEmailModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      tryVerify: false
    }
  }
  
  verifyEmail = async (e) => {
    e.preventDefault();
    var user = firebase.auth().currentUser;
    await user.reload().then(res => {
      return res
    });
    var userVerified = user.emailVerified;
    if (userVerified){
      this.props.closeModal();
    } else{
      this.setState({tryVerify: true})
    }
  }

  signOut = () => {
    firebase.auth().signOut().then(res => {
      return res;
    }).catch(err => {
      console.log(err)
    });
    this.props.userNotAuthed() 
  }
  
  render() {
    return (
      <Modal show={this.props.show} backdrop='static' id='verify-modal'>
        <Modal.Header>
          <p onClick={this.signOut}>Sign Out</p>
        </Modal.Header>

        <Modal.Body>
          <h4>Please verify your account's email address</h4>
          {this.state.tryVerify ? <p className="popupVerify">Please verify your email to gain access</p> : <p></p>}         
          <button onClick={this.verifyEmail}>Email Verified</button>
        </Modal.Body>
      </Modal>
    )
  }
}