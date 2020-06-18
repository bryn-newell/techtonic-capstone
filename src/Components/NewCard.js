import React, { Component } from 'react';
import './ItemCard.css'

export default class NewCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayWarning: false,
    }
  }

  checkTitleLength = () => {
    if (this.refs.newTitle.value.length >= 20) {
      this.setState({ displayWarning: true })
    } else this.setState({ displayWarning: false })
  }

  render() {
    return (
      <div className="item-container edit-container">
        <header className="item-header">
          <p>New Item</p>
        </header>

        <div className="item-body">

          <section className="title-row">
            <label>Item Name</label>
            <input name="title" placeholder="Item" className='title-input' maxLength='20' ref='newTitle' onChange={this.checkTitleLength} ></input>
          </section>
            {this.state.displayWarning ? <small className="text-muted length-warning">Sorry, item name cannot be more than 20 characters long.</small> : <></>}

          <section className="link-row">
            <label>Link</label>
            <input name="link" placeholder="Link" className="link-input"></input>
          </section>

          <section className="description-row">
            <label>Description</label>
            <textarea name="description" rows="3" columns="4" placeholder="Description" className="description-input"></textarea>
          </section>

        </div>

        <footer className="item-footer">
          <button onClick={this.props.cancelAddItem}>Cancel</button>
          <button onClick={this.props.addItem}>Save Changes</button>
        </footer>
      </div>
    )
  }
}