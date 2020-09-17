import React from 'react';
import uniqueRandom from 'unique-random';
import Header from '../components/Header/Header';
import Review from '../components/Review/Review';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      availableMovies: [],
      lang: '',
      genre: '',
      user: {},
      likedMovies: [],
      uniqueLikedMovies: [],
      route: 'review',
      component: null,
      isLoading: false,
      isApiFetch: false
    }
  }

  // When user visits the page the movie api will be called and save the data in movies state
  componentDidMount() {
    this.setState({isLoading: true})
    this.gettingUserWithToken()
    const random = uniqueRandom(1, 400);
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${YOUR_API_KEY}&language=en-US&page=${random()}`)
    .then(resp => resp.json())
    .then(data => {
      if(data.results) {
        this.setState({isLoading: false, movies: data.results, isApiFetch: true})
        this.settingFirstTwoMovies()
      }
    })
    .catch(err => this.setState({isApiFetch: false, isLoading: false}))
  }


  // To save the users data in the state
  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        joined: user.joined,
        favouritemovie: user.favouritemovie,
        favouriteactor: user.favouriteactor
      }
    })    
  }

  // When user change the page route
  onRouteChange = (route) => {
    
    // Adding Code-splitting
    if(route === 'review') {
      this.setState({ route: route })
    } else if (route === 'profile') {
      import('../components/Profile/ProfileDetails/ProfileDetails').then(ProfileDetails => {
        this.setState({route: route, component: ProfileDetails.default})
      })
    } else if (route === 'voteresults') {
      import('../components/VoteResults/VoteResults').then(VoteResults => {
        this.setState({route: route, component: VoteResults.default})
      })
    }
  }

  // If the user visit the site check whether use has Valid Jwt token or not
  gettingUserWithToken = () => {
    const token = window.localStorage.getItem('token');
    if(token) {
      fetch('http://localhost:3001/signin', { // on Docker-toolbox change localhost to 192.168.99.100
        method: 'post',
        headers: {'Content-type': 'application/json', 'Authorization': token}
      })
      .then(resp => resp.json())
      .then(data => {
        if(data && data.id) {
          fetch(`http://localhost:3001/profile/${data.id}`, { // on Docker-toolbox change localhost to 192.168.99.100
            method: 'get',
            headers: {'Content-type': 'application/json', 'Authorization': token}
          })
          .then(resp => resp.json())
          .then(user => {
            if(user && user.name) {
              this.loadUser(user)
            }
          })
        }
      })
      .catch(console.log)
    }
  }

  // Grabing first two movies from movies object state and saving 2 movies to the availableMovies state (because we need only 2 movies for UI)
  settingFirstTwoMovies = () => {
    for(let i = 0; i <= 1; i++) {
      this.setState(prevState => ({
        availableMovies: [...prevState.availableMovies, this.state.movies[i]]
      }))
    }
  }

  // When the user clicks Back button when they were on the <VoteResults/> route the new movies obj will load
  onBackPress = () => {
    this.setState({isLoading: true})
    this.setState({movies: [], availableMovies: []})
      const random = uniqueRandom(1, 400);
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${YOUR_API_KEY}&language=en-US&page=${random()}`)
      .then(resp => resp.json())
      .then(data => {
        if(data.results) {
          this.setState({movies: data.results, isLoading: false, isApiFetch: true})
          this.settingFirstTwoMovies()
        }
    })
    .catch(err => this.setState({isApiFetch: false, isLoading: false}))
  }

  // When the language and genre category changes
  updateLanguageGenre = (lang, genre) => {
    this.setState({movies: [], availableMovies: [], lang: lang, genre: genre, isLoading: true})
    let random = uniqueRandom(1, 400);
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${YOUR_API_KEY}&language=${lang}&with_genres=${genre}&page=${random()}`)
    .then(resp => resp.json())
    .then(data => {
      if(data.results) {
        this.setState({isLoading: false, movies: data.results, isApiFetch: true})
        this.settingFirstTwoMovies()
      }
    })
    .catch(err => this.setState({isApiFetch: false, isLoading: false}))
  }

  updateCurrentMovieList = (index, count) => {
    const {availableMovies, movies} = this.state
    // removing the not voted movie from available movies state
    if(availableMovies[index + 1]) {
      movies.splice(1, 1);
    } else if(availableMovies[index - 1]){
      movies.splice(0, 1);
    }

    // Getting looped if we voted a film it will replace the not voted film with new one
    let value = []
    for(let i = 0; i <= 1; i++) {
        value.push(this.state.movies[i]);
        this.setState({availableMovies: value})
    }
    value = [];

    // getting new set of movie objects if the movies state is empty
    if(count + 1 >= 18) { 
      const random = uniqueRandom(1, 400);
      this.setState({isLoading: true})
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${YOUR_API_KEY}&language=${this.state.lang}&with_genres=${this.state.genre}&page=${random()}`)
      .then(resp => resp.json())
      .then(data => { 
        if(data.results) {
          this.setState(prevState => ({
            movies: this.state.availableMovies.concat(data.results),
            isLoading: false,
            isApiFetch: true
          }))
        }
      })
      .catch(err => this.setState({isApiFetch: false, isLoading: false}))
    } 
  }

  // When user clicks vote button the current movies will be stored on the likedMovies state 
  // (i.e -> [{id: 123, title: 'movie1', likes: 1}, {id: 123, title: 'movie1', likes: 2}]) => 2 times vote click on same movie 
  setLikedMovies = (movie) => {
    this.setState(prevState => {
        return {likedMovies: [...prevState.likedMovies, movie]}
    })
    this.sortByLikesDesc(); // for sorting movies by highest voted

    // For desc sorted likedMovies state convert to unique for grabing the same title movie items first movie which have highest likes  
    let unique = this.state.likedMovies
    .map(e => e['id'])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(obj=> this.state.likedMovies[obj])
    .map(e => this.state.likedMovies[e]);
    this.setState({uniqueLikedMovies: unique})
  }  

  // Sorting the likedMovies List Array to descending order (like means vote)
  sortByLikesDesc = () => { //Here likes word described as an Votes, (Like = vote)
    let sortedMoviesAsc;
    sortedMoviesAsc= this.state.likedMovies.sort((a,b)=>{
      return parseInt(b.likes)  - parseInt(a.likes);
    })
    this.setState({likedMovies:sortedMoviesAsc})
  }

render() {
  const { availableMovies, uniqueLikedMovies, user, route } = this.state;
  return (
    <div className="App">
      {
        route === 'review'?
          (
            <>
            <Header user={user} loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            <Review 
              availableMovies={availableMovies}
              updateCurrentMovieList={this.updateCurrentMovieList}
              updateLanguageGenre={this.updateLanguageGenre}
              loadUser={this.loadUser}
              setLikedMovies={this.setLikedMovies}
              onRouteChange={this.onRouteChange}
              isLoading={this.state.isLoading}
              isApiFetch={this.state.isApiFetch}
            />
            </>
          ): <this.state.component user={user} onRouteChange={this.onRouteChange} loadUser={this.loadUser} uniqueLikedMovies={uniqueLikedMovies} onBackPress={this.onBackPress}/>
      }
    </div>
  );
}  
}

export default App;
