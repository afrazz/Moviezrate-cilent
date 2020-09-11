import React, { Component } from 'react';
import ProfileIcon from '../Profile/ProfileIcon/ProfileIcon';
import { TiArrowBackOutline } from 'react-icons/ti';
import './VoteResults.css';

export default class VoteResults extends Component {

    showVotedMovies = () => {
        return this.props.uniqueLikedMovies.map((cur, i )=> {
            return (
               
               <tbody key={i}>
                   <tr>
                       <td>{i + 1}</td>
                       <td>{cur.title}</td>
                       <td>{cur.likes}</td>
                   </tr>
               </tbody>
           
            )        
        })
    }

    onBackBtnPress = () => {
        this.props.onRouteChange('review');
        this.props.onBackPress()
    }

    render() {
        return (
            <div className="vote-results">
                <nav>
                    <p onClick={this.onBackBtnPress}><span><TiArrowBackOutline/></span></p>
                    <ProfileIcon onRouteChange={this.props.onRouteChange} loadUser={this.props.loadUser}/>
                </nav>
                <table className="container">
               <thead>
                   <tr>
                       <th><h1>#Rank</h1></th>
                       <th><h1>Movies</h1></th>
                       <th><h1>Votes</h1></th>
                   </tr>
               </thead>
                    {this.showVotedMovies()}
                </table>
            </div>
        )
    }
}

