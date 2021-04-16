import React from 'react'
import {Route} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import { Container, Navbar, Nav, NavDropdown} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import { useHistory } from "react-router-dom";


const Header = () => {

    const dispatch = useDispatch();
    const { auth } = useSelector((state) => ({ ...state }));
    const history = useHistory();

    const logout = () => {
    dispatch({
        type: "LOGOUT",
        payload: null,
    });
    window.localStorage.removeItem("auth");
    history.push("/login");
    };

    const logoutHandler = () =>{
        dispatch(logout());
    }

    return (
        <header>
            <Navbar bg="primary" variant='dark' expand="lg"  collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>HotelBookings</Navbar.Brand>
                    </LinkContainer>

                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                   
                    
                        <Nav className="ml-auto">
                                
                        {auth && <LinkContainer to='/dashboard'>
                        <Navbar.Brand>Account Details</Navbar.Brand>
                    </LinkContainer>} 
                            
                            {auth ? (
                                <NavDropdown title={auth.user.name} id='username'>
                                    <LinkContainer to='/profile'>
                                    <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler} >Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (<LinkContainer to='/login'>
                                    <Nav.Link><i className='fas fa-user'></i>Sign In</Nav.Link>
                                </LinkContainer>)}                            
                        </Nav>
                    </Navbar.Collapse>
            </Container>
            </Navbar>
        </header>
    )
}

export default Header
