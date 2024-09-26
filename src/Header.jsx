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
            const response = await fetch(`http://localhost:8081/uncleared/${employeeId}`, {
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

    const handleNotificationClick = (notification) => {
        console.log(`Notification clicked: ${notification.id}`);
        // Add any logic here to handle notification click (e.g., navigate to a specific page)
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
                                    <li key={notification.id} onClick={() => handleNotificationClick(notification)}>
                                        {notification.type === 'REQUEST' ? (
                                            <>
                                                A leave request from {notification.leaveRequest.employee.name}
                                            </>
                                        ) : (
                                            <>
                                                Your leave request from {notification.leaveRequest.leaveStartDate} to {notification.leaveRequest.leaveEndDate} has been {notification.leaveRequest.status}
                                            </>
                                        )}
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



