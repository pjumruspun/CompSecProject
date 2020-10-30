import logo from './logo.svg';
import './App.css';
import { useCookies } from 'react-cookie';
import React, { useEffect } from 'react';

function App() {
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    if(cookies.token === undefined) {
      window.location.assign('/login');
    }
  },[]);

  return (
    <div className="App">
      <div>token = {cookies.token}</div>
    </div>
  );
}

export default App;
