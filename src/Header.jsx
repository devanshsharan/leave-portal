import React, { useEffect, useRef, useState } from 'react';
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
    const dropdownRef = useRef(null);
    const bellRef = useRef(null);

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

    const postStatusUpdate = async (status) => {
        try {
            const response = await fetch('http://localhost:8081/updateStatus', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    employeeId: employeeId,
                    response: status
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update notification status');
            }
            const result = await response.text();
            console.log(result);
        } catch (error) {
            console.error("Error sending status update:", error);
        }
    };

    const handleBellClick = () => {
        if (!showNotifications) {
            fetchNotifications();
        } else if(notifications.length > 0){
            postStatusUpdate("SEEN");
        }
        setShowNotifications(prev => !prev);
    };

    const handleClearNotifications = async () => {
        if (notifications.length > 0) { 
            setNotifications([]); 
            await postStatusUpdate("CLEARED"); 
        }
    };

    const handleNotificationClick = (notification) => {
        console.log(`Notification clicked: ${notification.id}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                bellRef.current && !bellRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
                if(notifications.length > 0){
                    postStatusUpdate("SEEN"); 
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef, bellRef]);

    return (
        <div className="header parent">
            <div>
                <img src={logo} alt="Logo" />
            </div>
            <div className="for-bell">
                <div ref={bellRef} onClick={handleBellClick}>
                    <FaBell className="bell-icon" />
                </div>
                {showNotifications && (
                    <div className="notification-dropdown" ref={dropdownRef}>
                        <ul>
                            {notifications.length === 0 ? (
                                <li>No notifications</li>
                            ) : (
                                notifications.map(notification => (
                                    <li 
                                        key={notification.id} 
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        {notification.type === 'REQUEST' ? (
                                            <>
                                                A new leave request from {notification.leaveRequest.employee.name} has arrived.
                                            </>
                                        ) : (
                                            <>
                                                Your leave request from {notification.leaveRequest.leaveStartDate} to {notification.leaveRequest.leaveEndDate} is now {notification.responseStatus}
                                            </>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                        {notifications.length > 0 && ( 
                            <button type="button" className="clear-button" onClick={handleClearNotifications}>
                                Clear 
                            </button>
                        )}
                    </div>
                )}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Header;






