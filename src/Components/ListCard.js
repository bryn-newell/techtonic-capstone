import React from 'react';
import ItemCard from './ItemCard'
import NewCard from './NewCard'
import addButton from '../images/plusSignBlack.png'
import shareBtn from '../images/share.png'
import deleteBtn from '../images/delete.png';
import './ListCard.css';
import './ItemCard.css'
import firebase from '../firebase.js'
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

export default class ListCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemArray: [],
      newItem: false,
      displayName: '',
    }
  }

  componentDidMount() {
    if (this.props.listid) {
      const itemsRef = firebase.database().ref(`lists/${this.props.listid}`);
      itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
          //This is for the keys in the list array that are not item objects and needs to be updated if we add anything else to the list
          if (item !== 'listName' && item !== 'userId') {
            newState.push({
              id: item,
              title: items[item].title,
              link: items[item].link,
              description: items[item].description,
              purchased: items[item].purchased,
              purchasedBy: items[item].purchasedBy
            });
          }
        }
        this.setState({
          itemArray: newState
        });
      });

      //Setting the display name from the user database information
      const listRef = firebase.database().ref(`lists/${this.props.listid}`);
      listRef.on('value', (snapshot) => {
        const userId = snapshot.val().userId
        if (userId) {
          const userRef = firebase.database().ref(`users/${userId}`)
          userRef.on('value', (snapshot) => {
            const displayName = snapshot.val().name;
            this.setState({ displayName: displayName })
          })
        }
      })
    }

    //State on Body will change when the first list is created, so a new item card should display on the initial first list
    if(this.props.newItem) {
      this.setState({ newItem: true })
    }
  }

  addItem = () => {
    var titleInput = document.querySelector('.title-input');
    var linkInput = document.querySelector('.link-input');
    var descInput = document.querySelector('.description-input');

    const itemsRef = firebase.database().ref(`lists/${this.props.listid}`);
    const item = {
      title: titleInput.value,
      link: linkInput.value,
      description: descInput.value,
      purchased: false,
    };
    itemsRef.push(item);

    titleInput.value = '';
    linkInput.value = '';
    descInput.value = '';

    this.setState({
      newItem: false
    })
  }

  updateItem = (editedObj, id) => {
    firebase.database().ref(`lists/${this.props.listid}/${id}`).update(editedObj);
  }

  deleteItem = (e) => {
    const id = e.target.parentNode.parentNode.dataset.id;
    const title = e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1].value;
    let verifyDelete = window.confirm(`Are you sure you want to delete ${title}?`);
    if (verifyDelete) {
      const itemRef = firebase.database().ref(`lists/${this.props.listid}/${id}`);
      itemRef.remove();
    }
  }

  cancelAddItem = () => {
    this.setState({ newItem: false });
  }

  showNewItem = () => {
    this.setState({ newItem: true }); 
    document.querySelector('.list-body').scroll(0, 0);
  }

  handleChange = (id, purchased) => {
    const editObj = {};
    purchased ? editObj.purchased = true : editObj.purchased = false;
    purchased ? editObj.purchasedBy = firebase.auth().currentUser.uid : editObj.purchasedBy = null;
    firebase.database().ref(`lists/${this.props.listid}/${id}`).update(editObj);
  }

  handleDeleteTooltipShow = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState(s => ({ target, deleteShow: !s.show }));
    }
  };

  handleDeleteTooltipHide = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState({ target, deleteShow: false });
    }
  };

  handleAddTooltipShow = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState(s => ({ target, addShow: !s.show }));
    }
  };

  handleAddTooltipHide = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState({ target, addShow: false });
    }
  };

  handleShareTooltipShow = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState(s => ({ target, shareShow: !s.show }));
    }
  };

  handleShareTooltipHide = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState({ target, shareShow: false });
    }
  };

  render(){
    return(
      <div className="list-container">

        <header className="list-header">
          <h1>{this.state.displayName.length < 13 ? this.state.displayName : this.state.displayName.split(' ')[0]}'s List</h1>

          {this.props.shared ? 
            <button className="shared-list-icon" onClick={this.props.deleteSharedList}>
              <img onMouseEnter={this.handleDeleteTooltipShow} onMouseLeave={this.handleDeleteTooltipHide} src={deleteBtn} alt="Delete this list from your shared view" id={this.props.listid}/>
              <Overlay show={this.state.deleteShow} target={this.state.target} placement={'right'}>
                <Tooltip>Remove this list from your shared list</Tooltip>
              </Overlay>
            </button>
          : 
          <div className="my-list-icon">
              <button onClick={this.showNewItem}>
                <img className="plus-sign-black" onMouseEnter={this.handleAddTooltipShow} onMouseLeave={this.handleAddTooltipHide} src={addButton} alt="Create a new gift item" />
                <Overlay show={this.state.addShow} target={this.state.target}>
                  <Tooltip>Create a new item</Tooltip>
                </Overlay>
            </button>

              <button onClick={this.props.showModal}>
                <img onMouseEnter={this.handleShareTooltipShow} onMouseLeave={this.handleShareTooltipHide} src={shareBtn} alt="Share this list with friends" />
                <Overlay show={this.state.shareShow} target={this.state.target}>
                  <Tooltip>Share this list with friends!</Tooltip>
                </Overlay>
            </button>
          </div>
          }
        </header>

      <div className="list-body">
        { this.state.newItem ? <NewCard addItem={this.addItem} cancelAddItem={this.cancelAddItem} />
        : <div></div>
        }

        { this.state.itemArray.map((item) => {
          return <ItemCard itemObj={item} key={item.id} updateItem={this.updateItem} deleteItem={this.deleteItem} shared={this.props.shared} handleChange={this.handleChange} />
          })
        }
      </div>
      
      {this.props.shared ? <footer className='shared-footer'></footer> :
        <footer className="list-footer">
          <button className="btm-btn add-button" onClick={this.showNewItem}>Add Item</button>
          <button className="btm-btn" onClick={this.props.showModal} >Share</button>
        </footer>
      }
    </div>
    )
  }
}
