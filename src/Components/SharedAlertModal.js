import React from 'react';
import Modal from 'react-bootstrap/Modal';
import './SharedAlertModal.css';

export default class SharedAlertModal extends React.Component {
  render() {
    return (
      <Modal {...this.props} id='shared-alert-modal'>
        <Modal.Header closeButton>
          <h2 onClick={this.signOut}>Welcome to the Gift of Giving!</h2>
        </Modal.Header>

        <Modal.Body>
          <p>It looks like someone has shared a list with you! Please log in or create an account to view it.</p>
        </Modal.Body>

        <Modal.Footer>
          <button onClick={this.props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    )
  }
}