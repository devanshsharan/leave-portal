import React, { useState, useEffect } from 'react';
import '../Css/LeaveCard.css';
import LeaveForm from './LeaveForm';
import { GiSandsOfTime } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";
import { GiSkullCrossedBones } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";
import { FaAnglesDown,FaAnglesUp } from "react-icons/fa6";
import useFetchManagerResponses from '../CustomHooks/useFetchManagerResponses';

function LeaveCard({ leave }) {
    const [leaveDynamic, setLeaveDynamic] = useState(leave);
    const [error1, setError1] = useState(null);
    const [loading1, setLoading1] = useState(true);
    const [showResponses, setShowResponses] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [flag, setFlag] = useState(false);
    const [formData, setFormData] = useState({
        leaveRequestId: '',
        leaveStartDate: '',
        leaveEndDate: '',
        leaveType: '',
        leaveReason: ''
    });

    const { managerResponses, error, loading, fetchManagerResponses } = useFetchManagerResponses();

    useEffect(() => {
        setLeaveDynamic(leave);
    }, [leave]);

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            leaveRequestId: leaveDynamic.id,
            leaveStartDate: leaveDynamic.leaveStartDate,
            leaveEndDate: leaveDynamic.leaveEndDate,
            leaveType: leaveDynamic.leaveType,
            leaveReason: leaveDynamic.leaveReason
        }));
    }, [leave.id,showModal]);

    useEffect(() => {
        setIsCancelled(leave.status === 'CANCELLED');
    }, [leave.status]);

    useEffect(() => {
        if (leaveDynamic.id) {
            fetchManagerResponses(leaveDynamic.id);
        }
    }, [leave.id, flag,fetchManagerResponses]);

    /*useEffect(() => {
        const fetchManagerResponses = async () => {
            const token = localStorage.getItem('jwt');

            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8081/managerResponseList/${leave.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch manager responses');
                }

                const data = await response.json();
                setManagerResponses(data);

            } catch (error) {
                console.error('Error fetching manager responses:', error);
                setError('Error fetching manager responses');
            } finally {
                setLoading(false);
            }
        };
        fetchManagerResponses();
    }, [flag, leave.id]);*/

    const handleToggleResponses = () => {
        setShowResponses(!showResponses);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();

        const monthAbbreviations = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        return `${day} ${monthAbbreviations[month - 1]} ${year}`; 
    };

    const getResponseIcon = (response) => {
        switch (response) {
            case 'APPROVED':
                return <FaCheckCircle style={{ color: '#28A745' }} />;
            case 'REJECTED':
                return <GiSkullCrossedBones style={{ color: '#DC3545' }} />;
            case 'CANCELLED':
                return <FcCancel />;
            case 'PENDING':
            default:
                return <GiSandsOfTime style={{ color: '#FFA500' }} />;
        }
    };

    const handleCancel = async () => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            setError1('No token found');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/cancel', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ leaveRequestId: leave.id })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel leave');
            }

            setIsCancelled(true);

        } catch (error) {
            console.error('Error cancelling leave:', error);
            setError1('Error cancelling leave');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');

        try {
            const response = await fetch('http://localhost:8081/reschedule', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message);
                throw new Error(errorData.message);
            }

            setLeaveDynamic(prev => ({
                ...prev,
                leaveStartDate: formData.leaveStartDate,
                leaveEndDate: formData.leaveEndDate,
                leaveType: formData.leaveType,
                leaveReason: formData.leaveReason,
            }));
            setFlag(prev => !prev);
            setShowModal(false);

        } catch (error) {
            console.log(error);
            setLoading1(false);
        }
    };

    const handleClick = () => {
        if (leave.status !== "PENDING") {
            alert("Leave request is already " + leave.status);
        } else {
            setShowModal(true);
        }
    };

    return (
        <div className="history-card">
            <div className="row1">
                <div className="leaveType">{leaveDynamic.leaveType}</div>
                <div className="row11">
                    <div className="date">
                        {leaveDynamic.leaveStartDate === leaveDynamic.leaveEndDate ? (
                            formatDate(leaveDynamic.leaveStartDate) 
                        ) : (
                            `${formatDate(leaveDynamic.leaveStartDate)} - ${formatDate(leaveDynamic.leaveEndDate)}` 
                        )}
                    </div>
                    <div className="cancel-reschedule-box">
                        <button
                            type="button"
                            className="btn btn-outline-danger cancel-button"
                            onClick={handleCancel}
                            disabled={isCancelled}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-success cancel-button"
                            onClick={handleClick}
                            disabled={isCancelled}
                        >
                            Reschedule
                        </button>
                    </div>
                    
                    <div className="arrow-icon" onClick={handleToggleResponses}>
                        {showResponses ? <FaAnglesUp /> : <FaAnglesDown />}
                    </div>
                </div>
                <div className={`icons-design status ${isCancelled ? 'cancelled' : leaveDynamic.status.toLowerCase()}`}>
                     <span>
                         {isCancelled ? 'CANCELLED' : leaveDynamic.status}
                     </span>
                     <span>
                         {getResponseIcon(isCancelled ? 'CANCELLED' : leaveDynamic.status)}
                     </span>
                </div>

            </div>

            {showResponses && (
                <div className="response-section">
                    {loading ? (
                        <p>Loading manager responses...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : managerResponses.length > 0 ? (
                        <div className="manager-responses">
                            <div className="leave-reason2 leaveReason">
                                <div className="leave-reason-heading">Leave Reason:</div>
                                <div>{leaveDynamic.leaveReason}</div>
                            </div>
                            <h6>Approval Status:</h6>
                            {managerResponses.map((response, index) => (
                                <div key={index} className="response-card1">
                                    <div className="response-inside1">
                                        <div>{response.manager.name}</div>
                                        <div>{isCancelled ? 'No Comments' :response.comments}</div>
                                        <div className={`icons-design status ${isCancelled ? 'cancelled' : response.response.toLowerCase()}`}>
                                             <span>
                                                 {isCancelled ? 'CANCELLED' : response.response}
                                             </span>
                                             <span>
                                                 {getResponseIcon(isCancelled ? 'CANCELLED' : response.response)}
                                             </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No manager responses</p>
                    )}
                </div>
            )}
            <LeaveForm handleSubmit={handleSubmit} setFormData={setFormData} formData={formData} setShowModal={setShowModal} showModal={showModal} />
        </div>
    );
}

export default LeaveCard;






