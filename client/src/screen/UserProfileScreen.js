import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { useNavigate } from 'react-router-dom';

const UserProfileScreen = () => {
  const {
    state: { userInfo },
    dispatch: ctxDispatch,
  } = useContext(Store);
  const navigate = useNavigate();

  const [name, setName] = useState(userInfo?.name);
  const [email, setEmail] = useState(userInfo?.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.put(
        'https://mishka-store.herokuapp.com/api/users/updateprofile',
        { name, email, password, confirmPassword },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      console.log('data', data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully!');
    } catch (error) {
      toast.error(getError(error));
    }
  };
  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Button type="submit">Change Details</Button>
      </form>
    </div>
  );
};

export default UserProfileScreen;
