import React, { Component } from 'react';
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import Navigation from './Navigation/Navigation';
import './Header.css';

export default class Header extends Component {
    render() {
        const { user, loadUser } = this.props;    
        return (
            <div className="header">
                <Navigation user={user} loadUser={loadUser} onRouteChange={this.props.onRouteChange}/>
                <div className="main-content">
                    <h2>Vote the latest Movies</h2><span><AiOutlineStar /> <AiFillStar /> <AiOutlineStar /></span>
                </div>
            </div>
        )
    }
}
