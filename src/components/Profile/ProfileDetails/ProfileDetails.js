import React from 'react';
import './ProfileDetails.css';
import profileIcon from '../ProfileIcon/profileicon.png';
import { TiArrowBackOutline } from 'react-icons/ti';


export default class ProfileDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            favouritemovie: this.props.user.favouritemovie,
            favouriteactor: this.props.user.favouriteactor
        }
    }

    onProfileDetailsInputChange = (event) => {
        switch(event.target.name) {
            case 'favourite-movie':
                this.setState({favouritemovie: event.target.value})
                break;
            case 'favourite-actor':
                this.setState({favouriteactor: event.target.value})
                break;
            default:
                return;
        }
    }

    onSaveBtnClick = () => {
        fetch(`http://localhost:3001/profile/${this.props.user.id}`, { // on Docker-toolbox change localhost to 192.168.99.100
            method: 'post',
            headers: {'Content-type': 'application/json', 'Authorization': window.localStorage.getItem('token')},
            body: JSON.stringify({
                favouritemovie: this.state.favouritemovie,
                favouriteactor: this.state.favouriteactor
            })
        })
        .then(resp => resp.json())
        .then(data => {
            if(data === 'success') {
                this.props.loadUser({...this.props.user, ...this.state});
                this.props.onRouteChange('review')
            } else {
                window.alert('Unable to update')
            }       
        })
    }

    render() {
        const { user } = this.props;
        const { favouritemovie, favouriteactor } = this.state;
        return (
            <div className="profile-details">
                <nav onClick={() => this.props.onRouteChange('review')}><TiArrowBackOutline/></nav>
                <div className="profile-container">
                    <div className="wrapper">
                        <div id="box">
                            <img src={profileIcon} alt="profile-icon" />
                            <h3>{user.name}</h3>
                            <form>
                            <div className="fav-section"> 
                            <label id="fav-movie">Favourite Movie</label>    
                            <input type="text" className="fav-mov-inp" placeholder={favouritemovie} name="favourite-movie" onChange={this.onProfileDetailsInputChange}/>
                            </div>
                            <div className="fav-section"> 
                            <label id="fav-actor">Favourite Actor</label> 
                            <input type="text" className="fav-mov-inp" placeholder={favouriteactor} name="favourite-actor" onChange={this.onProfileDetailsInputChange}/>
                            </div>
                            </form>
                            <input type="submit" value="Save Changes" onClick={this.onSaveBtnClick}/>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
    
}
