import React, { Component } from 'react';
import editBtn from '../images/edit.png';
import './ItemCard.css';
import './ExampleItemCard.css'

export default class ExampleItemCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      editMode:false,
    }
  }

  render() {
    const {title, description, link, id} = this.props.itemObj;
    return(
      <div id='example-item-card' className="item-container">
        <header className="item-header" data-id={id}>
          <p>{title}</p>
          { this.props.shared ? 
          <div className='purchased-option'>
            <label className='text-muted'>Purchased</label>
            <input type='checkbox' ref='checkbox' disabled></input>
          </div> 
          : 
          <button disabled><img src={editBtn} alt="example of the edit button" /></button>
          }
        </header>

        <section className="item-body">
          <p className='fake-link'>{link.slice(0, 25).concat('...')}</p>
          <p>{description}</p>
        </section>
        
      </div>
      )
  }
}