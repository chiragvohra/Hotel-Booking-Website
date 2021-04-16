import React, { useState, useEffect } from 'react'
import {  Form, Button, Row, Col, Container } from 'react-bootstrap'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../actions/auth'

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const dispatch = useDispatch()

  const { auth } = useSelector((state) => ({ ...state }));
  const {user,token} = auth

  useEffect(() => {
    if (!auth) 
    {
      history.push('/login')
    } 
    else 
    {
        if (success)
        {
        } 
        else 
        {
        setName(user.name)
        setEmail(user.email)
        }
    }
  }, [dispatch, history, user, auth, success])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
    //   setMessage('Passwords do not match')
    }
    // else if(password.length < 6)
    // {
    //     setMessage('Password length < 6')
    // }
    else {
    //   dispatch(updateUserProfile({ id: user._id, name, email, password }))

        try 
        {
            let res = await updateUserProfile(token, user._id, name, email, password);
            
            // setSuccess(res.data.ok);
            
            dispatch({
              type: "UPDATE_RESET",
            });
            
            dispatch({
                type: "UPDATE_USER_PROFILE",
                payload: res.data,
              });
            toast.success(`${res.data.user.name}'s Profile updated Successfully`);
        } 
        catch (err) 
        { 
            console.log(err);
            toast.error(err.response.data.err);
        }
    }
  }

  return (
    <div className="container">
    <div className="col-md-6 offset-md-3">
    <Row>
      <Col md={11}>
        <h1>User Profile</h1>
        {/* {message && <Message variant='danger'>{message}</Message>} */}
        {}
        {/* {success && <Message variant='success'>Profile Updated</Message>} */}
        {
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        }
      </Col>
      </Row>
      </div>
      </div>
  )
}

export default ProfileScreen
