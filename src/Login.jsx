import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Loginpage.css';

function Login  () {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError('Both fields are required.');
      alert('Both fields are required');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) throw new Error('Invalid username or password');
  
      const data = await response.json(); 
      console.log(data); 
      
      localStorage.setItem('jwt', data.jwt);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('role', data.role);
      localStorage.setItem('employeeId', data.employeeId); 
      console.log(localStorage.getItem('employeeId')); 
  
      navigate('/home');
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  };
  

  return (
    <div className="loginpage">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;