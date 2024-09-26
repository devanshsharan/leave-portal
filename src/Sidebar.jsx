import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { MdOutlineTimeToLeave, MdQuestionAnswer, MdPeople, MdOutlineEmojiPeople, MdTimeToLeave } from "react-icons/md";
import './Css/Sidebar.css';

function Sidebar() {
    const location = useLocation(); 
    const userRole = localStorage.getItem('role');

    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        const currentPath = location.pathname.split('/').pop();
        console.log('Current Path:', currentPath); 
        if (currentPath === 'home') {
            setActiveItem('dashboard');
        } else {
            setActiveItem(currentPath);
        }
        console.log('Active Item Set To:', activeItem); 
    }, [location]);

    return (
        <div className="sidebar">
            <ul className="sidebar-menu">
                <li className={`sidebar-item ${activeItem === 'dashboard' ? 'active' : ''}`}>
                    <Link to="/home" onClick={() => setActiveItem('dashboard')}><FaHome /> Dashboard</Link>
                </li>
                {(userRole === 'MANAGER' || userRole === 'EMPLOYEE') && (
                    <li className={`sidebar-item ${activeItem === 'leaves' ? 'active' : ''}`}>
                       <Link to="/home/leaves" onClick={() => setActiveItem('leaves')}><MdTimeToLeave /> Leaves</Link>
                    </li>
                )}
                {(userRole === 'MANAGER' || userRole === 'ADMIN') && (
                    <li className={`sidebar-item ${activeItem === 'leave-response' ? 'active' : ''}`}>
                        <Link to="/home/leave-response" onClick={() => setActiveItem('leave-response')}><MdQuestionAnswer /> Leave Response</Link>
                    </li>
                )}
                <li className={`sidebar-item ${activeItem === 'teams' ? 'active' : ''}`}>
                    <Link to="/home/teams" onClick={() => setActiveItem('teams')}><MdPeople /> Teams</Link>
                </li>
                <li className={`sidebar-item ${activeItem === 'people' ? 'active' : ''}`}>
                    <Link to="/home/people" onClick={() => setActiveItem('people')}><MdOutlineEmojiPeople /> People</Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;








