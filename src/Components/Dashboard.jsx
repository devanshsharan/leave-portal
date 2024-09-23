import React, { useEffect, useState } from 'react';
import '../Css/Dashboard.css'; 

function Dashboard() {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      const token = localStorage.getItem('jwt'); 
      const employeeId = localStorage.getItem('employeeId');

      if (!token) {
        setError('No token found');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/employees/${employeeId}`, { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employee details');
        }

        const data = await response.json();
        setEmployee(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmployeeDetails();
    
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); 

    return () => clearInterval(intervalId); 
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  
  const capitalizeName = (name) => {
    if (!name) return 'Loading...';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="dashboard">
      <div className="info-container">
        
        <div className="welcome-box">
          <h2>Welcome! {capitalizeName(employee ? employee.name : 'Loading...')}</h2>
        </div>

       
        <div className="info-box">
          <div className="date-time box1">
            <span className="label">Today:</span>
            <span className="value">{formatDate(currentDate)}</span>
          </div>
          <div className="current-time box1">
            <span className="label">Current Time:</span>
            <span className="value">{formatTime(currentDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;



