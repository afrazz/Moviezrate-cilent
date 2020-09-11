import React from 'react';
import './Navigation.css';
import Modal from '../../Modal/Modal';
import Signin from '../../Signin/Signin';
import Register from '../../Register/Register';
import ProfileIcon from '../../Profile/ProfileIcon/ProfileIcon';

export default class Navigation extends React.Component {

constructor( props ) {
    super( props );
    this.state = {
        showModal: false,
        route: 'signin'
    }
}
abortController = new AbortController()

onFormRouteChange = (route) => {
    this.setState({route: route})
}

toggleModal = () => {
    this.setState({
        showModal: ! this.state.showModal
    })
};

componentWillUnmount() {
    this.abortController.abort()
}

render() {
    const { showModal, route } = this.state;
    const { user, loadUser, } = this.props;
    return (
        <nav>
            <h1 className="main-head">Moviezvote</h1>
            {
                Object.keys(user).length === 0 || user.id === '' ?
                <h2 className="modal-toggle-button" onClick={this.toggleModal}>Sign In</h2>:
                <h2><ProfileIcon loadUser={loadUser} onRouteChange={this.props.onRouteChange}/></h2>
            }
            {
                showModal ? (
                    <Modal>
                        {
                            route === 'signin'? 
                                <Signin  toggleModal={this.toggleModal} onFormRouteChange={this.onFormRouteChange} loadUser={loadUser}/>:
                            route === 'register'?
                                <Register toggleModal={this.toggleModal} onFormRouteChange={this.onFormRouteChange} loadUser={loadUser}/>:
                                null
                        }
                    </Modal>
                ) : null
            }
        </nav>
    )


}
   
}