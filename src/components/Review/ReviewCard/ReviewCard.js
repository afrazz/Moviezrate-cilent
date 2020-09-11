import React from 'react'
import { BiLike } from 'react-icons/bi';
import { CgPoll } from 'react-icons/cg';
import { AiOutlineHeart } from 'react-icons/ai';

import Modal from '../../Modal/Modal';
import Signin from '../../Signin/Signin';
import Register from '../../Register/Register';
import { genreData } from '../../../genreData';
import './ReviewCard.css';

export default class ReviewCard extends React.Component {
    constructor() {
        super();
        this.state = {
            btnClickCount: 0,
            showSignin: false,
            showModal: false,
            route: 'signin',
            clickedIds: [],
            movieLikes: 0,
            UserAuth: false
        }
    }

    onFormRouteChange = (route) => {
        this.setState({route: route})
    }
    
    toggleModal = () => {
        this.setState({
            showModal: ! this.state.showModal
        })
    };

    movieLikeCountController = () => {
        if(this.state.clickedIds[this.state.clickedIds.length -1] === this.state.clickedIds[this.state.clickedIds.length - 2 ]) {
            this.setState(prevState => ({
                movieLikes: prevState.movieLikes + 1,
            }));
           
        } else if(this.state.clickedIds[this.state.clickedIds.length -1] !== this.state.clickedIds[this.state.clickedIds.length - 2 ]) {
            this.setState({movieLikes: 1})   
        }
    }

    whenUserAuthDone = (cur) => {
        this.setState({UserAuth: true});

        // Making sure the user has clicked vote button under 18 clicks either both two cards. If higher than 18, set as zero
        // If user gets 18clicks we have fetch the new 20 set of object from API
        if(this.state.btnClickCount >= 18) {
            this.setState({btnClickCount: 0})
        }   

        this.setState(prevState => ({
            btnClickCount: prevState.btnClickCount + 1,
            clickedIds: [...prevState.clickedIds, cur.id] // store voted Movie ID
        }));

       const index = this.props.availableMovies.indexOf(cur); // checking app state of availableMovies for which we have voted
       this.props.updateCurrentMovieList(index, this.state.btnClickCount);
       
       this.movieLikeCountController();
       
       let currentMovie = {
           id: cur.id,
           title: cur.title,
           likes: this.state.movieLikes 
       }

       this.props.setLikedMovies(currentMovie);      
    }

    onVoteBtnClick = (cur) => {
        fetch('http://localhost:3001/profileauth', { // on Docker-toolbox change localhost to 192.168.99.100
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.localStorage.getItem('token')
            }
        })
        .then(resp => resp.json())
        .then(data => {
            if(data === 'auth ok') {
                this.whenUserAuthDone(cur)
            } else {
                this.setState({UserAuth: false})
                this.toggleModal()
                this.setState({showSignin: true});
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }
        })
    }

  
    adjustSize = () => {
        if(document.querySelector('.card').clientHeight <= 410) {
            document.querySelector('.card').style.height = '410px';
        } else {
            document.querySelector('.card').style.height = 'auto';
        }
    }

    updatingMoviesList = () => {
        return this.props.availableMovies.map((cur, index) => {
            if(cur) {
                return (
                    <div key={cur.id} className="card" onLoad={this.adjustSize}>
                        <div className="side-left">
                        {
                            cur.poster_path === null? <h2>No Poster</h2>: <img className="poster" alt="movie-poster" src={`https://image.tmdb.org/t/p/w500/${cur.poster_path}`}/>
                        }
                           
                        </div>
                        <div className="side-right">
                            <div className="heart-like"><span><AiOutlineHeart /> {
                                cur.id === this.state.clickedIds[this.state.clickedIds.length - 1] ? this.state.movieLikes : 0
                            }
                            </span></div>
                            <div className="card-upper-text">
                            {   
                                genreData.map((genreCur, i) => {
                                    const threeGenreId = []
                                    for(let i = 0; i < 3; i++) {
                                        threeGenreId.push(cur.genre_ids[i])
                                    }
                                    return threeGenreId.map(id => id === genreCur.value ? <h2 key={i}>{genreCur.label}</h2>: null)
                                })
                            }
                            </div>
                            <h1>{cur.title}</h1>
                            <hr/>
                            {
                                cur.overview === ''? <h2>No Overview Found</h2>: <p>{cur.overview}</p>
                            }
                                <button className='btn' onClick={() => this.onVoteBtnClick(cur)}>Vote <BiLike /></button>                                   
                       </div>
                    </div>
                )    
            } else {
                console.log('something went wrong')
            }
        })
    }

    onVoteResultClick = () => {
        fetch('http://localhost:3001/profileauth', { // on Docker-toolbox change localhost to 192.168.99.100
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.localStorage.getItem('token')
            }
        })
        .then(resp => resp.json())
        .then(data => {
            if(data === 'auth ok') {
                this.props.onRouteChange('voteresults')
            } else {
                alert('You have to Signin first')
            }
        })
    }

    render() {
        return (
            <div>
            {
                this.state.showSignin ?
                this.state.showModal ? (
                    <Modal>
                        {
                            this.state.route === 'signin'? 
                                <Signin  toggleModal={this.toggleModal} onFormRouteChange={this.onFormRouteChange} loadUser={this.props.loadUser}/>:
                            this.state.route === 'register'?
                                <Register toggleModal={this.toggleModal} onFormRouteChange={this.onFormRouteChange} loadUser={this.props.loadUser}/>:
                                null
    
                        }
                    </Modal>
                ) : null
                : ''
            }
            <div className="review-card">
            {this.updatingMoviesList()}
            </div>
            <div className="btn-align">
            {
                this.state.UserAuth ? <button className="btn btn-secondary" onClick={this.onVoteResultClick}>Check Voted Results <CgPoll className="poll"/></button>: null
            }
            </div>
            
            </div>
        )
    }
    
}
