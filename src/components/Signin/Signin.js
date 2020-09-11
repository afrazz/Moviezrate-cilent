import React, { Component } from 'react';
import './Signin.css';

export default class Signin extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
        }
    }

    onSigninInputChange = (event) => {
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

    saveTokenAuth = (token) => {
        window.localStorage.setItem('token', token)
    }

    onSigninSubmit = () => {
        const { username, password } = this.state;
            fetch('http://192.168.99.100:3001/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              name: username,
              password: password
            })
        })
        .then(resp => resp.json())
        .then(data => {
            if(data.success === 'true' && data.userId) {
                this.saveTokenAuth(data.token);
                fetch(`http://192.168.99.100:3001/profile/${data.userId}`,{
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': window.localStorage.getItem('token')
                    }
                })
                .then(resp => resp.json())
                .then(user => {
                    if(user.id && user.name) {
                        this.props.loadUser(user)
                        this.props.toggleModal();
                    }  
                })
            } else {
                document.querySelector('.error-msg').textContent = 'Cannot Match';
            }
        }) 
    }

    onEnterPress = (e) => {
        if(e.key === 'Enter'){
           this.onSigninSubmit()
        }
    }

    render() {
        return (
            <div>
                <div className='signin' onKeyPress={this.onEnterPress}>
                    <span 
                        className="modal-close"
                        onClick={this.props.toggleModal}
                    >&#10006;</span>
                    <div className="error-msg"></div>
                     <h1>Sign In</h1>
                     <input type="text" placeholder="Username" className="" name="username" onChange={this.onSigninInputChange} maxLength="15"/>
                     <input type="password" placeholder="Password" className="" name="password" onChange={this.onSigninInputChange} />
                     <button onClick={this.onSigninSubmit}>Sign In</button>
                     <p onClick={() => this.props.onFormRouteChange('register')}>Register</p>
                     </div>
            </div>
        )
    }
}
