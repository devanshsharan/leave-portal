import React, { useState, useEffect } from 'react';
import '../Css/Leaves.css';
import LeaveCard from './LeaveCard';

function Leaves() {
    const [leaveDetails, setLeaveDetails] = useState(null);
    const [leaveRequests, setLeaveRequests] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        employeeId: '',
        leaveStartDate: '',
        leaveEndDate: '',
        leaveType: '',
        leaveReason: ''
    });
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('jwt');
            const employeeId = localStorage.getItem('employeeId');

            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            setFormData(prevFormData => ({
                ...prevFormData,
                employeeId: employeeId
            }));

            try {
                const detailsResponse = await fetch(`http://localhost:8081/totalLeave/${employeeId}`, { 
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!detailsResponse.ok) {
                    throw new Error('Failed to fetch leave details');
                }

                const detailsData = await detailsResponse.json();
                setLeaveDetails(detailsData);

                const requestsResponse = await fetch(`http://localhost:8081/leaveRequestList/${employeeId}`, { 
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (requestsResponse.status === 204) {
                    setLeaveRequests([]); 
                } else if (!requestsResponse.ok) {
                    throw new Error('Failed to fetch leave requests');
                } else {
                    const requestsData = await requestsResponse.json();
                    setLeaveRequests(requestsData);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [flag]); 

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowModal(false);
        const token = localStorage.getItem('jwt');

        try {
            const response = await fetch('http://localhost:8081/apply', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to apply for leave');
            }

            const result = await response.json();
            

            setFlag(prev => !prev);

        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="leaves-section">
            <div className="leave-cards">
                <div className="leave-card casual-leave">
                    <h3>Casual Leave</h3>
                    <div className="leave-details">
                        <div className='leave-inside'>
                            <div className="leave-box leave-box1">
                                <div className="box-content">
                                    {leaveDetails ? leaveDetails.totalCasualLeave : 'N/A'}
                                </div>
                            </div>
                            <span className="box-label">Entitled Leaves</span>
                        </div>
                        <div className='leave-inside'>
                            <div className="leave-box leave-box2">
                                <div className="box-content">
                                    {leaveDetails ? leaveDetails.casualLeaveTaken : 'N/A'}
                                </div>
                            </div>
                            <span className="box-label">Availed Leaves</span>
                        </div>
                    </div>
                </div>
                <div className="leave-card hospitalization-leave">
                    <h3>Hospitalization Leave</h3>
                    <div className="leave-details">
                        <div className='leave-inside'>
                            <div className="leave-box leave-box1">
                                <div className="box-content">
                                    {leaveDetails ? leaveDetails.totalHospitalizationLeave : 'N/A'}
                                </div>
                            </div>
                            <span className="box-label">Entitled Leaves</span>
                        </div>
                        <div className='leave-inside'>
                            <div className="leave-box leave-box2">
                                <div className="box-content">
                                    {leaveDetails ? leaveDetails.hospitalizationLeaveTaken : 'N/A'}
                                </div>
                            </div>
                            <span className="box-label">Availed Leaves</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="leave-history">
                {leaveRequests !== null && leaveRequests.length > 0 ? (
                    <div className="history-columns">
                        {leaveRequests.map((leave, index) => (
                            <LeaveCard key={index} leave={leave} />
                        ))}
                    </div>
                ) : (
                    <p>No leave history</p>
                )}
            </div>
            <button
                type="button"
                className="btn btn-primary btn-floating"
                onClick={() => setShowModal(true)}
            >
                <span className="plus-icon">+</span>
            </button>

            
            <div className={`modal fade ${showModal ? 'show' : ''}`} id="applyLeaveModal" tabIndex="-1" aria-labelledby="applyLeaveModalLabel" aria-hidden={!showModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="applyLeaveModalLabel">Apply for Leave</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="leaveStartDate" className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        id="leaveStartDate"
                                        name="leaveStartDate"
                                        className="form-control"
                                        value={formData.leaveStartDate}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="leaveEndDate" className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        id="leaveEndDate"
                                        name="leaveEndDate"
                                        className="form-control"
                                        value={formData.leaveEndDate}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="leaveType" className="form-label">Leave Type</label>
                                    <select
                                        id="leaveType"
                                        name="leaveType"
                                        className="form-control"
                                        value={formData.leaveType}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="">Select Leave Type</option>
                                        <option value="CASUAL">Casual Leave</option>
                                        <option value="HOSPITALIZATION">Hospitalization Leave</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="leaveReason" className="form-label">Leave Reason</label>
                                    <textarea
                                        id="leaveReason"
                                        name="leaveReason"
                                        className="form-control"
                                        value={formData.leaveReason}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leaves;




