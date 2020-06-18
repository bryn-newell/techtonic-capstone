import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import logoWhite from '../images/expanded-logo.png';
import './Header.css';
import firebase from '../firebase';

export default class Header extends React.Component {
  handleLogout = () => {
    window.location.pathname = '/';
    firebase.auth().signOut().then(res => {
      return res
    }).catch(err => {
      console.log(err)
    });
    this.props.userNotAuthed();
  }

  scrollToTop = () => {
    document.querySelector('#outer-most-section-home').scroll(0, 0);
  }

  render() {
    return (
      <Navbar sticky='top' className="navbar" onClick={this.scrollToTop}>
          <img className="header-logo d-inline-block align-left" src={logoWhite} alt="The Gift of Giving logo" />
          <button id="navbar-text" className="d-inline-block justify-content-end" onClick={this.handleLogout}>Sign Out</button>
      </Navbar>
    );
  };
};
