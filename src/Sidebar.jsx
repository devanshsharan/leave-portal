import React, { useState } from 'react';
import './Css/Sidebar.css'; // Import your CSS

function Sidebar({ onSelect }) {
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const userRole = localStorage.getItem('role');

  const handleClick = (item) => {
    setSelectedItem(item);
    onSelect(item);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-menu">
        <li className={`sidebar-item ${selectedItem === 'Dashboard' ? 'active' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); handleClick('Dashboard'); }}>Dashboard</a>
        </li>
        <li className={`sidebar-item ${selectedItem === 'Leaves' ? 'active' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); handleClick('Leaves'); }}>Leaves</a>
        </li>
        {userRole !== 'EMPLOYEE' && (
          <li className={`sidebar-item ${selectedItem === 'LeaveResponse' ? 'active' : ''}`}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleClick('LeaveResponse'); }}>Leave Response</a>
          </li>
        )}
        <li className={`sidebar-item ${selectedItem === 'Teams' ? 'active' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); handleClick('Teams'); }}>Teams</a>
        </li>
        <li className={`sidebar-item ${selectedItem === 'People' ? 'active' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); handleClick('People'); }}>People</a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;


