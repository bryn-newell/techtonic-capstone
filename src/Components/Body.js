import React from 'react';
import ListCard from './ListCard';
import ExampleList from './exampleList';
import ShareModal from './ShareModal';
import plusSignWhite from '../images/plusSignWhite.png';
import './Body.css';
import firebase from '../firebase';
import VerifyEmailModal from './VerifyEmailModal';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

export default class Body extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      existingList: false,
      listKey: '',
      uid: '',
      sharedList: [],
      shareModalShow: false,
      emailModalShow: false,
      verifyModal: false,
      newItem: false,
    }
  }

  //Getting information from the user database side
  componentDidMount() {
    const currentUser = firebase.auth().currentUser;
    var listRef = firebase.database().ref(`lists/`);

    if (!currentUser.emailVerified && !this.props.loggedInWithFacebook) {
      this.setState({ verifyModal: true })
    };

    if (currentUser !== null) {
      this.setState({ uid: currentUser.uid })
      const userRef = firebase.database().ref(`users/${currentUser.uid}`);
      userRef.on('value', (snapshot) => {
        //if the user has already created at least one list - keep the state as true and display it
        if(snapshot.val()) {
          if (firebase.database().ref(`users/${currentUser.uid}/myLists`)) {
            if (snapshot.val().myLists) {
              this.setState({
                existingList: true,
                listKey: snapshot.val().myLists
              });
            }
          }
          //Setting the state of shared lists to an array populated by the sharedWithMe node in a user's database
          const sharedRef = firebase.database().ref(`users/${currentUser.uid}/sharedWithMe`)
          const sharedListArr = [];
          sharedRef.once('value', snapshot => {
            if(snapshot.val()) {
              snapshot.forEach(function (childSnapshot) {
                sharedListArr.push(childSnapshot.val())
              })
            }
          })
          this.setState({ sharedList: sharedListArr })
        }
      })

      //This code block runs when a shared link is clicked - to add that list to your sharedWithMe Database
      if (window.location.pathname !== '/') {
        const path = window.location.pathname;
        //removing the slash to get just the list id
        var listid = path.split('')
        listid.splice(0, 1)
        listid = listid.join('');

        listRef.once('value', snapshot => {
          if(snapshot.child(listid).exists() === true) {
            userRef.on('value', (snapshot) => {
              //Check if the the list id is the same as the current logged in user's list - preventing the list creator to see their own list in the shares state
              if (snapshot.val().myLists !== listid) { 
                //Check if there is already a sharedWithMe node for this user
                if (snapshot.val().sharedWithMe) {
                  //Checks to see if this particular list id is already in sharedWithMe. If it is, do NOT push up to the database - otherwise it will do so infinitely
                  let match = false;
                  firebase.database().ref(`users/${currentUser.uid}/sharedWithMe`).once('value', snapshot => {
                    snapshot.forEach(function (childSnapshot) {
                      if (childSnapshot.val() === listid) {
                        match = true
                      }
                    })
                  })
                  //Once we know it doesn't already exist in sharedWithMe, push it up
                  if (match === false) {
                    firebase.database().ref(`users/${currentUser.uid}/sharedWithMe`).push(listid);
                    window.location.pathname = '/';
                    this.props.userAuthed();
                  }
                } else {
                  //This else statment runs when sharedWithMe doesn't exist yet so it can early exit out of the above code block 
                  firebase.database().ref(`users/${currentUser.uid}/sharedWithMe`).push(listid)
                }
              }
            })
          }
        })
      }
    }
  }

  addList = () => {
    //Prevents the user from creating more than one list 
    firebase.database().ref(`users/${this.state.uid}/myLists`).once('value', snapshot => {
      if (!snapshot.exists()) {
        //creating a new list node in the database with the userid appended
        const listRef = firebase.database().ref('lists').push({
          userId: this.state.uid,
        })
        const listKey = { myLists: listRef.key }
        firebase.database().ref(`users/${this.state.uid}`).update(listKey);

        //Change the state of new item to true so the first new item card displays and remove the tooltip from displaying once that add new list button is removed
        this.setState({ newItem: true, show:false });
      }
    })
  }

  shareModalClose = () => {
    this.setState({ shareModalShow: false })
  }

  shareModalShow = () => {
    this.setState({ shareModalShow: true })
  }

  emailModalClose = () => {
    this.setState({ emailModalShow: false })
  }

  emailModalShow = () => {
    this.setState({ emailModalShow: true })
  }

  verifyModalClose = () => {
    this.setState({ verifyModal: false })
  }

  deleteSharedList = (e) => {
    const sharedListRef = firebase.database().ref(`users/${this.state.uid}/sharedWithMe`)
    const title = e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerText;
    let verifyDelete = window.confirm(`Are you sure you want to delete ${title}?`);
    if(verifyDelete){
      let targetListKey;
      sharedListRef.orderByKey().on('value', snap => {
        snap.forEach(function (childSnapshot){
          if(e.target.id === childSnapshot.val()){
            targetListKey = childSnapshot.key;
          }
        })
      })
      const targetListRef = firebase.database().ref(`users/${this.state.uid}/sharedWithMe/${targetListKey}`)
      targetListRef.remove()
      .then(function() {
          console.log("Remove succeeded.")
      })
      .catch(function(error) {
          console.log("Remove failed: " + error.message)
      });
    }
  }

  handleTooltipShow = ({ target }) => {
    if(!this.state.existingList) {
      if (window.matchMedia("(min-width: 750px)").matches) {
        this.setState(s => ({ target, show: !s.show }));
      }
    }
  };

  handleTooltipHide = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState({ target, show: false });
    }
  };

  render() {
    return (
      <div id="outer-most-section-home">
        <header className=" row-one header-list">
          <h1>My List</h1>
          {this.state.existingList ? <></> 
          :
          <button>
            <img src={plusSignWhite} alt="Create a new list" onClick={this.addList} onMouseEnter={this.handleTooltipShow} onMouseLeave={this.handleTooltipHide} className='new-list-button' />
          </button> 
          }
        </header>

        <Overlay className="myListExample" show={this.state.show} target={this.state.target} container={this} placement={'bottom'} id='first-list-tooltip'>
          <Tooltip>Click here to create your first list!</Tooltip>
        </Overlay>

        <div className='my-list'>
          {this.state.existingList ? 
          <ListCard listid={this.state.listKey} userid={this.state.uid} showModal={this.shareModalShow} newItem={this.state.newItem} /> 
          : 
          <ExampleList />
          }
        </div>

        <hr className="line"></hr>

        <div className="row-one header-list-shared">
          <h1>Lists Shared With Me</h1>
        </div>

        {this.state.sharedList.length !== 0 
        ? 
        <div className='shared-lists'>
          {this.state.sharedList.map(list => {
          return <ListCard listid={list} key={list} shared={true} deleteSharedList={this.deleteSharedList}/>}
          )}
        </div>
        : 
          <div className='shared-lists'>
            <ExampleList sharedList = {true} />
            <div className='tooltip-holder'></div>
          </div> 
        }

        <ShareModal show={this.state.shareModalShow} onHide={this.shareModalClose} listid={this.state.listKey}/>
        <VerifyEmailModal userNotAuthed={this.props.userNotAuthed} show={this.state.verifyModal} closeModal={this.verifyModalClose} />
      </div>
    )
  }
}