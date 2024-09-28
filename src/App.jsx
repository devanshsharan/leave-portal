import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './Login';  
import Home from './Home';    
import Dashboard from './Components/Dashboard';
import Leaves from './Components/Leaves';
import LeaveResponse from './Components/LeaveResponse';
import Teams from './Components/Teams';
import People from './RightContent/People';

function App() {
    const userRole = localStorage.getItem('role');
    console.log(userRole);
    
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route path="" element={<Dashboard />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="leave-response" element={<LeaveResponse />} />  
          <Route path="teams" element={<Teams />} />
          <Route path="people" element={<People />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

/*
{(userRole === 'MANAGER' || userRole === 'EMPLOYEE') && (
  <Route path="leaves" element={<Leaves />} />
)}
{(userRole === 'MANAGER' || userRole === 'ADMIN') && (
  <Route path="leave-response" element={<LeaveResponse />} />
)}*/