import axios from 'axios';
import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./Login.css";

export default function Login() {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const LOGIN_ERROR_MSG = 'username/password is invalid';

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function onClickSubmit(event) {
    event.preventDefault();
    try {
      const result = axios.post('/api/login', { username, password });
      if (result.status === 200) window.location.href = '/blog';
      else setError(LOGIN_ERROR_MSG);
    } catch(e) {
      setError(LOGIN_ERROR_MSG);
    }
  }

  return (
    <div className="Login">
      <form onSubmit={onClickSubmit}>
        <FormGroup controlId="username" bsSize="large">
          <FormLabel>Username</FormLabel>
          <FormControl
            autoFocus
            type="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
