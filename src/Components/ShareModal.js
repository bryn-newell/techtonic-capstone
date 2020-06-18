import React from 'react';
import Modal from 'react-bootstrap/Modal';
import './ShareModal.css';


export default class ShareModal extends React.Component {
  copyLink = () => {
    const copyText = document.querySelector('.user-list-link');
    copyText.select();
    document.execCommand('copy');
    alert(`Copied the link ${copyText.value} to your clipboard.`)
  }

  render() {
  return (
    <Modal {...this.props} id='sharing-modal'>
    <Modal.Header closeButton>
      <Modal.Title>Share this list with friends!</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <p>Share this wish list with your friends and family so they know what to get you for your special day or event! Click the link below to copy to your clipboard and share it however you please. Or share access via email or Facebook.</p>
      <p onClick={this.copyLink}>
          <input className='user-list-link' value={`https://the-gift-of-giving.firebaseapp.com/${this.props.listid}`} readOnly={true} ></input>
      </p>
        <a href={`mailto:?subject=I want to share my gift list with you&body=Check out my wishlist through this site https://the-gift-of-giving.firebaseapp.com/${this.props.listid}`}
      title="Share by Email">
        <button>Share via Email</button>
      </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=the-gift-of-giving.firebaseapp.com/${this.props.listid}`}
      target="_blank" rel="noopener noreferrer" title="Share by Facebook">
        <button>Share via Facebook</button>
      </a>
    </Modal.Body>
    </Modal>
  )
  }
}