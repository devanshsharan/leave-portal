
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from './Header';
import Sidebar from './Sidebar';
import './Css/Home.css';
import Dashboard from './Components/Dashboard';
import Leaves from './Components/Leaves';
import LeaveResponse from './Components/LeaveResponse';
import Teams from './Components/Teams';
import People from './Components/People';


function Home() {
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const navigate = useNavigate(); 

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/');
    }
  }, [navigate]);

  const renderContent = () => {
    switch (selectedItem) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Leaves':
        return <Leaves />;
      case 'LeaveResponse':
        return <LeaveResponse />;
      case 'Teams':
        return <Teams />;
      case 'People':
        return <People />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar onSelect={setSelectedItem} />
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </>
  );
}

export default Home;


