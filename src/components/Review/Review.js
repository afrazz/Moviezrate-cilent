import React, { Component } from 'react';
import ReviewCategory from './ReviewCategory/ReviewCategory';
import ReviewCard from './ReviewCard/ReviewCard';
import LoadSpinner from '../LoadSpinner/LoadSpinner';
import './Review.css';



export default class Review extends Component {
    render() {
        const { availableMovies, updateCurrentMovieList, updateLanguageGenre, loadUser, setLikedMovies, onRouteChange, onResetMovies, isLoading, isApiFetch } = this.props;
        return (
            <div className="review">
                <ReviewCategory 
                    updateLanguageGenre={updateLanguageGenre}
                />
                {
                    isLoading ?
                     <LoadSpinner />:
                    !isApiFetch ?
                     <p style={{textAlign: 'center', color: '#fff', marginTop: '90px', marginBottom: '60px'}}>OOOPS SOMETHING WENT WRONG...</p>
                     : 
                     <ReviewCard 
                     availableMovies={availableMovies} 
                     updateCurrentMovieList={updateCurrentMovieList}
                     loadUser={loadUser}
                     setLikedMovies={setLikedMovies}
                     onRouteChange={onRouteChange}
                     onResetMovies={onResetMovies}
                 /> 
                }
               
            </div>
        )
    }
}
