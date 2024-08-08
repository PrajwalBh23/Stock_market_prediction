import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo1.png';
import './Header.css';
import LoginDialog from './Loginbox';
import { useAuth } from '../AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginClick = () => {
    setIsRegistering(false);
    setLoginDialogOpen(true);
  };

  const handleRegisterClick = () => {
    setIsRegistering(true);
    setLoginDialogOpen(true);
  };

  const handleLoginDialogClose = () => {
    setLoginDialogOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header" data-header>
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} width="45" height="40" alt="Cryptex logo" />
          MarketSage
        </Link>
        <nav className="navbar" data-navbar>
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link to="/" className="navbar-link active" data-nav-link>Homepage</Link>
            </li>
            <li className="navbar-item">
              <Link to="/" className="navbar-link" data-nav-link>About us</Link>
            </li>
            <li className="navbar-item">
              <Link to="/market" className="navbar-link" data-nav-link>Market</Link>
            </li>
            <li className="navbar-item">
              <Link to="https://news.google.com/search?pz=1&cf=all&hl=en-IN&q=BSE+SENSEX&ict=clu_top&gl=IN&ceid=IN:en" className="navbar-link" data-nav-link>News</Link>
            </li>
          </ul>
        </nav>
        <button className="nav-toggle-btn" aria-label="Toggle menu" data-nav-toggler>
          <span className="line line-1"></span>
          <span className="line line-2"></span>
          <span className="line line-3"></span>
        </button>
        <div className="btn-group">
          <input type="text" className="search-bar" placeholder="Search..." />
          {!user ? (
            <>
              <button className="btn btn-outline" onClick={handleLoginClick}>Log in</button>
              <button className="btn btn-outline" onClick={handleRegisterClick}>Sign up</button>
            </>
          ) : (
            <button className="btn btn-outline" onClick={handleLogout}>Log out</button>
          )}
        </div>
      </div>
      <LoginDialog 
        open={loginDialogOpen} 
        handleClose={handleLoginDialogClose} 
        isRegistering={isRegistering} 
      />
    </header>
  );
};

export default Header;
