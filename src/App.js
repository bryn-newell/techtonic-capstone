import React, { Component } from 'react';
import Body from './Components/Body';
import Header from './Components/Header';
import LandingPage from './Components/LandingPage';
import './App.css';
import firebase from './firebase';
export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      authorized: false,
      loggedInWithFacebook: false,
    }
    this.displayName = '';
  }

  userAuthed = () => {
    this.setState({authorized: true});
  }

  userNotAuthed = () => {
    this.setState({authorized: false})
  }

  loggedInWithFacebook = () => {
    this.setState({loggedInWithFacebook: true})
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.displayName = user.displayName;
        this.userAuthed();
      } 
    });
  }

  render() {
    return(
      <div>
        {this.state.authorized ? 
          <div className="App presents-background">
            <Header userNotAuthed={this.userNotAuthed} /> 
            <Body userNotAuthed={this.userNotAuthed} displayName={this.displayName} loggedInWithFacebook={this.state.loggedInWithFacebook} userAuthed={this.userAuthed} /> 
          </div> 
          : 
          <div className="App landing-background">
            <LandingPage userAuthed={this.userAuthed} loggedInWithFacebook={this.loggedInWithFacebook}/>
          </div>
        }
      </div>
    )
  }
}