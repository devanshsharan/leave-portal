import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Css/Header.css';
import logo from './assets/beehyvlogo.png';
import { FaBell } from "react-icons/fa";

function Header() {
    const navigate = useNavigate(); 
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const employeeId = localStorage.getItem('employeeId'); 
    const jwtToken = localStorage.getItem('jwt'); 

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('employeeId');
        navigate('/');
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`/api/notifications/uncleared/${employeeId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`, 
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setNotifications(data); 
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleBellClick = () => {
        fetchNotifications(); 
        setShowNotifications(!showNotifications); 
    };

    const handleClearNotifications = async () => {
        
        setNotifications([]); 
        
    };

    return (
        <div className="header parent">
            <div>
                <img src={logo} alt="Logo" />
            </div>
            <div className="for-bell">
                <FaBell className="bell-icon" onClick={handleBellClick} />
                {showNotifications && (
                    <div className="notification-dropdown">
                        <ul>
                            {notifications.length === 0 ? (
                                <li>No notifications</li>
                            ) : (
                                notifications.map(notification => (
                                    <li key={notification.id}>
                                        
                                        {notification.type}: {notification.leaveRequest.id}
                                    </li>
                                ))
                            )}
                        </ul>
                        <button onClick={handleClearNotifications}>Clear Notifications</button>
                    </div>
                )}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Header;

