import React, {Component} from 'react';
import './ProfileIcon.css'
import profileicon from './profileicon.png';

export default class ProfileIcon extends Component {

constructor() {
    super(); 
    this.state = {
      showMenu: false,
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.showMenu !== nextState.showMenu) {
        return true
    }
    return false;
  }

  showMenu(event) {        
    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }
  
  closeMenu() {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });  
  }

  userSignOut = () => {
    const { loadUser, onRouteChange } = this.props;
    fetch('http://localhost:3001/signout', { // on Docker-toolbox change localhost to 192.168.99.100
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('token')
        }
    })
    .then(resp => resp.json())
    .then(data => {
        if(data.signOut === 'success') {
            const removeUser = {
                id: '',
                name: '',
                joined: ''
            }
            window.localStorage.removeItem("token");
            loadUser(removeUser);
            if(onRouteChange) {
                onRouteChange('review')
            }
        } 
    })
  }

render() {
    return (      
        <div>
            <img src={profileicon} className="profile-icon" alt="profile-icon" onClick={this.showMenu}/>
            {
                this.state.showMenu
                    ? (
                    <div className="menu-container">
                        <div
                        className="menu animationFadeIn"
                        ref={(element) => {
                            this.dropdownMenu = element;
                        }}
                        >
                        <p onClick={() => this.props.onRouteChange('profile')}>View Profile</p>
                        <p onClick={this.userSignOut}>SignOut</p>
                        </div>
                    </div>
                    )
                    : (
                    null
                    )
            }
        </div>
    )   
}
}