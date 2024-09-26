import React, { useState, useEffect } from 'react';
import '../Css/Leaves.css';
import LeaveCard from '../RightContent/LeaveCard';
import Pagination from '../RightContent/Pagination';
import LeaveForm from '../RightContent/LeaveForm';

function Leaves() {
    const [leaveDetails, setLeaveDetails] = useState(null);
    const [leaveRequests, setLeaveRequests] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [offset, setOffset] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
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

                const requestsResponse = await fetch(`http://localhost:8081/leaveRequestList/${employeeId}/${offset}/${pageSize}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (requestsResponse.status === 204) {
                    console.log("here1");
                    setLeaveRequests([]); 
                } else if (!requestsResponse.ok) {
                   console.log(here2);
                    throw new Error('Failed to fetch leave requests');
                } else {
                    const requestsData = await requestsResponse.json();
                    setLeaveRequests(requestsData.content);
                    setTotalPages(requestsData.totalPages); 
                    console.log(requestsData);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [offset, pageSize, flag]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                const errorData = await response.json();
                alert(errorData.message);
                throw new Error(errorData.message); 
            }

            setFlag(prev => !prev);
            setShowModal(false);

        } catch (error) {
            console.error(error);
        }
        
    };

    if (loading) {
        return <p>Loading...</p>;
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
                {leaveRequests.length > 0 ? (
                    <div>
                        <div className="history-columns">
                            {leaveRequests.map((leave, index) => (
                                <LeaveCard key={index} leave={leave} />
                            ))}
                        </div>
                        <Pagination 
                            setOffset={setOffset} 
                            setCurrentPage={setCurrentPage} 
                            setPageSize={setPageSize}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize} 
                        />
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
            <LeaveForm 
                handleSubmit={handleSubmit} 
                setFormData={setFormData} 
                formData={formData} 
                setShowModal={setShowModal} 
                showModal={showModal} 
            />
        </div>
    );
}

export default Leaves;





