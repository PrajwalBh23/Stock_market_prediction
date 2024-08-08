import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';
import './PredictSection.css'; // Assuming you have a CSS file for additional styling
import Header from './Header';
import ban from '../images/ban.png';
import { useAuth } from '../AuthContext.js';
import LoginDialog from './Loginbox.js';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PredictSection = () => {
  const [stockName, setStockName] = useState('');
  const location = useLocation(); // Use useLocation to access route state
  const { state } = location; // Destructure the state object
  const tokenFromUrl = state ? state.token : null; // Access token from route state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false); // State to manage the login dialog
  const { loginOrNot, login, register } = useAuth(); // Use the loginOrNot and login functions from useAuth
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  const handleClose = () => {
    setLoginDialogOpen(false);
    // If the user is still not logged in after the dialog closes, navigate to home
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
        console.error('Error fetching data from backend:', error);
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

  const handlePredict = () => {
    // Logic to handle prediction
    navigate('/result');
  };

  return (
    <>
      <Header />
      <Container className='predict-container' style={{display:'flex', flexDirection:'row', margin:"80px auto"}} >
        <img src={ban} alt="Banner" className="predict-image" />
        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', marginTop:'20px' }}>
          <Typography style={{margin:'10px 0px'}} className='' variant="h4" gutterBottom>
            Predict the Future of Your Stocks
          </Typography>
          <TextField
            className='text-predict'
            label="Enter Stock Name"
            variant="outlined"
            fullWidth
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            style={{
                margin:'10px 0px',
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePredict}
            disabled={!stockName} // Disable button if no stock name is entered
            style={{
                margin:'20px 0px',
              fontSize: '15px', // Increased font size for the button text
              padding: '15px', // Increased padding for the button
            }}
          >
            Predict the Future
          </Button>
        </Paper>
      </Container>
      {!isLoggedIn && <LoginDialog open={loginDialogOpen} handleClose={handleClose} handleLogin={handleLogin} handleRegister={handleRegister} />}
    </>
  );
};

export default PredictSection;
