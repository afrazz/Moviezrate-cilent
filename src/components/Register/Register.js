import React, { Component } from 'react';
import './Register.css';

export default class Register extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
        }
    }

    onRegisterInputChange = (event) => {
        switch(event.target.name) {
            case 'username':
                this.setState({username: event.target.value})
                break;
            case 'password':
                this.setState({password: event.target.value})
                break;
            default:
                return;
        }
    }

    setAuthSession = (token) => {
        window.localStorage.setItem('token', token)
    }

    onRegisterSubmit = () => {
        fetch('http://locahost:3001/register', { // on Docker-toolbox change localhost to 192.168.99.100
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              name: this.state.username,
              password: this.state.password
            })
        })
        .then(resp => resp.json())
        .then(data => {
            if(data && data.userId) {
                this.setAuthSession(data.token);
                fetch(`http://locahost:3001/profile/${data.userId}`, { // on Docker-toolbox change localhost to 192.168.99.100
                    method: 'get',
                    headers: {'Content-type': 'application/json', 'Authorization': data.token},
                }).then(resp => resp.json())
                .then(user => {
                    if(user.id && user.name) {
                        this.props.loadUser(user)
                        this.props.toggleModal();
                    }     
                })  
            } else {
                document.querySelector('.error-msg').textContent = data;
            }    
        })
    }

    onEnterPress = (e) => {
        if(e.key === 'Enter'){
           this.onRegisterSubmit()
        }
    }

    render() {
        return (
            <div>
                <div className='register' onKeyPress={this.onEnterPress}>
                    <span 
                        className="modal-close"
                        onClick={this.props.toggleModal}
                    >&#10006;</span>
                    <div className="error-msg"></div>
                     <h1>Register</h1>
                     <input type="text" placeholder="Username" name="username" onChange={this.onRegisterInputChange} maxLength="15"/>
                     <input type="password" placeholder="Password" name="password" onChange={this.onRegisterInputChange}/>
                     <button onClick={this.onRegisterSubmit}>Register</button>
                     <p onClick={() => this.props.onFormRouteChange('signin')}>Sign In</p>
                </div>
            </div>
        )
    }
}
