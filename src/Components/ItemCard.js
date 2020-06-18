import React, { Component } from 'react';
import editBtn from '../images/edit.png';
import deleteBtn from '../images/delete.png';
import './ItemCard.css';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import firebase from '../firebase';

export default class ItemCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      displayWarning: false,
    }
  }

  toggleEditMode = (e) => {
    e.preventDefault();
    this.setState({ editMode: !this.state.editMode, editShow: false });
  }

  handleUpdate = (id) => {
    const editedObj = {};
    const editedTitle = document.querySelector('.edited-title').value;
    const editedLink = document.querySelector('.edited-link').value;
    const editedDesc = document.querySelector('.edited-description').value;
    editedObj.title = editedTitle;
    editedObj.link = editedLink;
    editedObj.description = editedDesc;
    this.props.updateItem(editedObj, id)
  }

  componentDidMount() {
    if (this.props.shared) {
      const { purchased, purchasedBy } = this.props.itemObj;
      const userId = firebase.auth().currentUser.uid;
      if (purchased) {
        this.refs.checkbox.checked = true;
        if (purchasedBy !== userId) {
          this.refs.checkbox.disabled = true;
        }
      }
    }
  }

  confirmPurchase = (id, title) => {
    const checkbox = this.refs.checkbox;
    if (checkbox.checked) {
      let confirmPurchase = window.confirm(`Are you sure you would like to mark ${title} as purchased?`);
      if (!confirmPurchase) {
        checkbox.checked = false;
      }
    }
    const purchased = checkbox.checked;
    this.props.handleChange(id, purchased, title);
  }

  validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

  seeMore = () => {
    var dots = this.refs.dots;
    var moreText = this.refs.seeMoreText;
    var btnText = this.refs.seeMoreButton;

    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerText = "Show More";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Show Less";
      moreText.style.display = "inline";
    }
  }

  checkTitleLength = () => {
    if(this.refs.editedTitle.value.length >= 20) {
      this.setState({displayWarning: true})
    } else this.setState({displayWarning: false})
  }

  handleEditTooltipShow = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState(s => ({ target, editShow: !s.show }));
    }
  };

  handleEditTooltipHide = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState({ target, editShow: false });
    }
  };

  handlePurchaseTooltipShow = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState(s => ({ target, purchaseShow: !s.show }));
    }
  };

  handlePurchaseTooltipHide = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState({ target, purchaseShow: false });
    }
  };

  handleURLTooltipShow = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState(s => ({ target, URLShow: !s.show }));
    }
  };

  handleURLTooltipHide = ({ target }) => {
    if (window.matchMedia("(min-width: 750px)").matches) {
      this.setState({ target, URLShow: false });
    }
  };

  render() {
    const { title, description, link, id } = this.props.itemObj;
    //This prevents an unvalid link from routing back to the app URL
    var editedLink = link;
    if (link.includes('http://www.') === false && link.includes('https://www.') === false
      && link.includes('https://') === false && link.includes('http://') === false) {
      if (link.includes('www.') === true) {
        editedLink = `//${link}`;
      }
      else editedLink = `//www.${link}`;
    }
    
    //Check if the text submitted to the link input is a valid url - if not change from an anchor to a paragraph element
    var isValidURL = true;
    if (this.validURL(link)) isValidURL = true;
    else isValidURL = false;

    //Shorten the link displayed if it's longer than 25 characters
    var shortenedLink = link;
    if (link.length > 25) {
      shortenedLink = link.slice(0, 25).concat('...')
    }

    //Shorten the description if it's longer than 100 characters and provide a see more
    var descTooLong = false
    var shortenedDesc;
    var hiddenDesc;
    if (description.length > 100) {
      descTooLong = true;
      shortenedDesc = description.slice(0, 100)
      hiddenDesc = description.slice(100)
    }

    if (this.state.editMode) {
      return (
        <div className="item-container edit-container">

          <header className="item-header" data-id={id}>
            <p>Edit Item</p>
            <button onClick={this.props.deleteItem}><img src={deleteBtn} alt="Delete this gift item" title='Delete this item' /></button>
          </header>

          <div className="item-body">
            <section className="title-row">
              <label htmlFor='title'>Item Name</label>
              <input name="title" defaultValue={title} className='edited-title' maxLength='20' ref='editedTitle' onChange={this.checkTitleLength} ></input>
            </section>
            {this.state.displayWarning ? <small className="text-muted length-warning">Sorry, item name cannot be more than 20 characters long.</small> : <></>}

            <section className="link-row">
              <label htmlFor='link'>Link</label>
              <input name="link" defaultValue={link} className='edited-link'></input>
            </section>

            <section className="description-row">
              <label htmlFor='description'>Description</label>
              <textarea name="description" rows="3" columns="4" defaultValue={description} className='edited-description'></textarea>
            </section>
          </div>

          <footer className="item-footer">
            <button onClick={this.toggleEditMode}>Cancel</button>
            <button onClick={() => { this.handleUpdate(id); this.setState({ editMode: !this.state.editMode }) }}>Save Changes</button>
          </footer>
        </div>
      )
    } else {
      return (
        <div className="item-container">

          <header className="item-header" data-id={id}>
            <p>{title}</p>
            {this.props.shared ?
              <div className='purchased-option'>
                <div onMouseEnter={this.handlePurchaseTooltipShow} onMouseLeave={this.handlePurchaseTooltipHide}>
                  <label className='text-muted' htmlFor='purchased'>Purchased</label>
                  <input type='checkbox' onChange={() => this.confirmPurchase(id, title)}  ref='checkbox' name='purchased' ></input>
                </div>

                {/* Checks if the checkbox is loaded in and disabled, and displays a different overlay if both are true. */}
                {this.refs.checkbox ? <>
                  {this.refs.checkbox.disabled ? 
                    <Overlay show={this.state.purchaseShow} target={this.state.target} placement='bottom-end'>
                      <Tooltip>This item has already been purchased by another user. Why don't you get them something else on their list?</Tooltip>
                    </Overlay> 
                    : 
                    <Overlay show={this.state.purchaseShow} target={this.state.target} placement='top' flip={true} >
                      <Tooltip>This will tell other viewers of this list, but not the owner, that the item has been purchased.</Tooltip>
                    </Overlay>
                  }</> 
                : <></> 
                }
              </div>
              : 
                <button onClick={this.toggleEditMode}>
                <img onMouseEnter={this.handleEditTooltipShow} onMouseLeave={this.handleEditTooltipHide} src={editBtn} alt="Edit this gift item" />
                  <Overlay show={this.state.editShow} target={this.state.target} placement='top' flip={true}>
                    <Tooltip>Edit this item</Tooltip>
                  </Overlay>
                </button>
            }
          </header>

          <div className="item-body">
            {isValidURL ? <a href={editedLink} target="_blank" rel="noopener noreferrer">{shortenedLink}</a>
              :
              <p className='not-a-link' onMouseEnter={this.handleURLTooltipShow} onMouseLeave={this.handleURLTooltipHide}>
              {shortenedLink}
                  <Overlay show={this.state.URLShow} target={this.state.target} placement='top-start' flip={true}>
                    <Tooltip>This is not a valid URL</Tooltip>
                  </Overlay>
              </p>
            }
            {descTooLong ?
              <p>{shortenedDesc}
                <span className='dots' ref='dots'>...</span>
                <span className='see-more-text' ref='seeMoreText'>{hiddenDesc}</span>
                <button onClick={this.seeMore} className='see-more-button' ref='seeMoreButton'>Show More</button>
              </p>
            : 
              <p>{description}</p>
            }
          </div>

        </div>
      )
    }
  }
}