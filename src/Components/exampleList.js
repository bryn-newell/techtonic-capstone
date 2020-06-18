import React from 'react';
import ExampleItemCard from './ExampleItemCard'
import './ListCard.css';
import './exampleList.css'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'

export default class ExampleList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      show: false,
      sharedItemArray:[
        {
          id: 1,
          title: 'A bonsai tree',
          link: 'https://www.bonsaioutlet.com/bonsai-trees/',
          description: "Karate Kid!",
          purchased: false,
        },
        {
          id: 2,
          title: 'Florida trip',
          link: 'www.myflorida.com',
          description: "Enjoy some nice warm water and sun",
          purchased: false,
        },
        {                            
          id: 3,
          title: 'A new car!',
          link: 'www.bmw.com',
          description: "X5 please",
          purchased: false
        },
      ],
      itemArray:[
        {
          id: 1,
          title: 'A trip to Montreal',
          link: 'https://www.mtl.org/en',
          description: "Bonjour!",
          purchased: false,
        },
        {
          id: 2,
          title: 'Red Rocks Concert',
          link: 'https://www.redrocksonline.com/',
          description: "Any concert will be awesome",
          purchased: false,
        },
        {                            
          id: 3,
          title: 'New bike',
          link: 'www.yeticycles.com',
          description: "A full suspension, carbon framed beast!",
          purchased: false
        },
      ]
    }
  }

  handleShow = ({ target }) => {
    if(window.matchMedia("(min-width: 750px)").matches){
      this.setState(s => ({ target, show: !s.show }));
    }
    };

  handleHide = ({ target }) => {
    if(window.matchMedia("(min-width: 750px)").matches){
      this.setState({ target, show: false });
    }
    };

  render(){
    return(
      <div id='example-list' className="list-container" onMouseEnter={this.handleShow} onMouseLeave={this.handleHide}>
        <Overlay id="example-overlay" show={this.state.show} target={document.querySelector('.tooltip-holder')} placement='right-start'  container={this} containerPadding={20} >
          <Popover id="popover-contained" title="Welcome to The Gift of Giving!"> 
            {this.props.sharedList 
              ? "Don’t have any lists shared with you yet? Invite your friends to use our app and share lists with each other!" 
              : "Click on the (+) in My List to start creating your first wish list."
            }
          </Popover>
        </Overlay>

        <header className="list-header">
          { this.props.sharedList ? <h1>Example Shared List</h1> : <h1>Example List</h1> }
          { this.props.sharedList ? <div></div> : <></> }
        </header>

        <div className="list-body">
          { this.props.sharedList ? this.state.sharedItemArray.map((item)=>{
            return <ExampleItemCard itemObj={item} key={item.id} shared={true}/> 
            })
          :
          this.state.itemArray.map((item)=>{
            return <ExampleItemCard itemObj={item} key={item.id} /> 
            })
          }
        </div>

        { this.props.sharedList ? <div className='shared-footer'></div> 
        : 
        <footer className="list-footer">
          <button className="btm-btn add-button" disabled>Add Item</button>
          <button className="btm-btn" disabled>Share</button>     
        </footer>
        }            
    </div>
    )  
  }
}