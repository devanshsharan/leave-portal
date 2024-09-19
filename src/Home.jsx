// Home.jsx
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Css/Home.css';
import Dashboard from './RightContent/Dashboard';
import Leaves from './RightContent/Leaves';
import LeaveResponse from './RightContent/LeaveResponse';
import Teams from './RightContent/Teams';
import People from './RightContent/People';


function Home() {
  const [selectedItem, setSelectedItem] = useState('Dashboard');

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


