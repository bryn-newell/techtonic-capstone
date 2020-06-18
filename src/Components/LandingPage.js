import React, { Component } from 'react';
import Login from './Login';
import CreateAccount from './CreateAccount';
import './LandingPage.css';
import bigLogo from '../images/logo.png';
import firebase from '../firebase';
import SharedAlertModal from './SharedAlertModal';

export default class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasAccount: true,
      sharedAlertModalShow: false,
    };
  }

  componentDidMount () {
    if (window.location.pathname !== '/') {
      const path = window.location.pathname;
      //removing the slash to get just the list id
      var listid = path.split('')
      listid.splice(0, 1)
      listid = listid.join('');

      firebase.database().ref(`lists/`).once('value', snapshot => {
        if (snapshot.child(listid).exists() === true) {
          this.modalShow();
        }
      })
    }
  }
  
  loginToggle = () => {
    this.setState({ hasAccount : true});
  }

  createAccountToggle = () => {
    this.setState({hasAccount : false});
  }

  handleGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    let googleName;
    let email;
    let usersRef;
    let userId;

    firebase.auth().signInWithPopup(provider).then(result => {
      googleName = result.user.displayName;
      email = result.user.email;
      usersRef = firebase.database().ref('users');
      userId = firebase.auth().currentUser.uid;

      usersRef.orderByChild('email').equalTo(email).once('value', snap => {
        if (!snap.exists()){
          const user = {
            name: googleName,
            email: email,
            sharedWithMe: []
          };
          usersRef.child(userId).set(user);
        }
      })
      this.props.userAuthed();
    }).catch(function (error) {
      console.log(error);
    });
  }

  handleFacebook = () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      if (result.user.email){
        const fbName = result.user.displayName;
        const email = result.user.email
        const userId = firebase.auth().currentUser.uid
        const usersRef = firebase.database().ref('users');
        usersRef.orderByChild('email').equalTo(email).once('value', snap => {
          if (!snap.exists()){
            const user = {
              name: fbName,
              email: email,
              sharedWithMe: []
            };
            usersRef.child(userId).set(user);
          }
        });
      } else if (result.user.email === null) {
        const fbName = result.user.displayName;
        const userId = firebase.auth().currentUser.uid
        const usersRef = firebase.database().ref('users')
        usersRef.orderByKey().equalTo(userId).once('value', snap => {
          if (!snap.exists()) {
            const user = {
              name: fbName,
              sharedWithMe: []
            };
            usersRef.child(userId).set(user);
          }
        });
      }
      this.props.loggedInWithFacebook();
    }).catch(function (error) {
      console.log(error);
    });
  }

  modalClose = () => {
    this.setState({ sharedAlertModalShow: false })
  }

  modalShow = () => {
    this.setState({ sharedAlertModalShow: true })
  }
  
  render() {
      return (
        <div className="LandingPage">
          <img className='nav-logo' src={bigLogo} alt="The Gift of Giving logo"/>
          
          {
          (this.state.hasAccount) ? 
          <Login createAccountToggle={this.createAccountToggle} userAuthed={this.props.userAuthed} google={this.handleGoogle} facebook={this.handleFacebook} testQuery={this.testQuery}/> 
          : 
          <CreateAccount loginToggle={this.loginToggle} google={this.handleGoogle} facebook={this.handleFacebook}/>
          }

          <img className='logo' src={bigLogo} alt="The Gift of Giving logo"/>

          <SharedAlertModal show={this.state.sharedAlertModalShow} onHide={this.modalClose}/>
        </div>
      )
    }
  }
