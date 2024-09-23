import React, { useState, useEffect } from 'react';
import '../Css/LeaveCard.css';
import LeaveForm from './LeaveForm';

function LeaveCard({ leave }) {
    const [leaveDynamic, setLeaveDynamic] = useState(leave);
    const [managerResponses, setManagerResponses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            leaveRequestId: leave.id
        }));
    }, [leave.id]);

    useEffect(() => {
        setLeaveDynamic(leave);
    }, [leave]);

    useEffect(() => {
        setIsCancelled(leave.status === 'CANCELLED');
    }, [leave.status]);

    useEffect(() => {
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
    }, [flag, leave.id]);

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

    const handleCancel = async () => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            setError('No token found');
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
            setError('Error cancelling leave');
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
            setLoading(false);
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
                    <div className="date">{formatDate(leaveDynamic.requestDate)}</div>
                    {isCancelled ? (
                        <button type="button" className="btn btn-secondary cancel-button" disabled>
                            Cancelled
                        </button>
                    ) : (
                        <div className="cancel-reschedule-box">
                            <button
                                type="button"
                                className="btn btn-outline-danger cancel-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-danger cancel-button"
                                onClick={handleClick}
                            >
                                Reschedule
                            </button>
                        </div>
                    )}
                    <div className="arrow-icon" onClick={handleToggleResponses}>
                        {showResponses ? '∧' : 'v'}
                    </div>
                </div>
                <div className="status">{isCancelled ? 'CANCELLED' : leaveDynamic.status}</div>
            </div>

            {showResponses && (
                <div className="response-section">
                    {loading ? (
                        <p>Loading manager responses...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : managerResponses.length > 0 ? (
                        <div className="manager-responses">
                            <div className="leaveReason">{leaveDynamic.leaveReason}</div>
                            <h6>Approval Status:</h6>
                            {managerResponses.map((response, index) => (
                                <div key={index} className="response-card1">
                                    <div className="response-inside1">
                                        <div>{response.manager.name}</div>
                                        <div>{response.response}</div>
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






