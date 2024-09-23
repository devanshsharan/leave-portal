import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Css/Header.css';
import logo from './assets/beehyvlogo.png';

function Header() {
    const navigate = useNavigate(); 
    const handleLogout = () => {
        
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('employeeId');
      
        
        navigate('/');
    };

    return (
        <div className="parent">
            <div>
                <img src={logo} alt="Logo" />
            </div>
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Header;
