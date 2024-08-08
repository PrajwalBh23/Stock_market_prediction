import React,  { useEffect, useState } from 'react'
import Header from './Header';
import { useAuth } from '../AuthContext.js';
import LoginDialog from './Loginbox.js';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Result() {
  const location = useLocation(); // Use useLocation to access route state
  const { state } = location; // Destructure the state object
  const tokenFromUrl = state ? state.token : null; // Access token from route state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false); // State to manage the login dialog
  const { loginOrNot, login, register } = useAuth(); // Use the loginOrNot and login functions from useAuth
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  const handleClose = () => {
    setLoginDialogOpen(false);
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedIn = await loginOrNot();
        setIsLoggedIn(loggedIn);

        if (!loggedIn) {
          setLoginDialogOpen(true);
          return;
        }

        const token = tokenFromUrl || localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(`http://localhost:5000/predict`, config);
        console.log(response);
      } catch (error) {
        console.error('Error fetching room data from backend:', error);
      }
    };
    fetchData();
  }, [loginOrNot, tokenFromUrl, navigate]);

  const handleLogin = async () => {
    try {
      await login(); // Call the login function
      const loggedInToken = localStorage.getItem('token'); // Retrieve token after login
      navigate(`/predict?token=${loggedInToken}`); // Redirect to /predict
    } catch (error) {
      console.error('Login failed:', error);
      navigate('/'); // Redirect to home if login fails
    }
  };

  const handleRegister = async () => {
    try {
      await register();
      const loggedInToken = localStorage.getItem('token');
      navigate(`/predict?token=${loggedInToken}`); // Redirect to /predict
    } catch (error) {
      console.error('Registration failed:', error);
      navigate('/'); // Redirect to home if registration fails
    }
  };

  return (
    <>
      <Header/>
      <div>Here You can add you prediction part</div>
      {!isLoggedIn && <LoginDialog open={loginDialogOpen} handleClose={handleClose} handleLogin={handleLogin} handleRegister={handleRegister} />}
    
    </>
  )
}
