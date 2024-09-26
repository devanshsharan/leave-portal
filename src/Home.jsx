import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom'; 
import Header from './Header';
import Sidebar from './Sidebar';
import './Css/Home.css';

function Home() {
  const navigate = useNavigate(); 

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="layout">
      <Header />
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;



