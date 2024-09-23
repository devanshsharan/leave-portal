import React, { useState } from 'react';
import '../Css/ResponseCard.css';

function ResponseCard({ response }) {
  const [showResponses, setShowResponses] = useState(false);
  const [isResponseChanged, setIsResponseChanged] = useState(response.response);
  const [overAllLeaveStatus, setOverAllLeaveStatus] = useState(response.leaveRequest.status);

  const handleClick = async (status) => {
    const token = localStorage.getItem('jwt');
    const employeeId = localStorage.getItem('employeeId');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const res = await fetch('http://localhost:8081/respond', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leaveRequestId: response.leaveRequest.id,
          managerId: employeeId,
          response: status,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'An error occurred');
        throw new Error('Failed to update response');
      }

      const data = await res.json();
      setIsResponseChanged(status);
      setOverAllLeaveStatus(data.leaveStatus);

    } catch (error) {
      console.error('Error updating response:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthAbbreviations = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return `${day} ${monthAbbreviations[month]} ${year}`;
  };

  const handleToggleResponses = () => {
    setShowResponses(!showResponses);
  };

  return (
    <div className="history-card">
      <div className="row1">
        <div className="leaveType">{response.leaveRequest.employee.name}</div>
        <div className="row11">
          {isResponseChanged === "APPROVED" || isResponseChanged === "REJECTED" ? (
            <div className="button-box1">
              <button 
                type="button" 
                className="btn btn-primary button2" 
                disabled
              >
                {isResponseChanged}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary button2"
                onClick={() => handleClick('PENDING')}
              >
                Change
              </button>
            </div>
          ) : isResponseChanged === "CANCELLED" ? (
            <button 
              type="button" 
              className="btn btn-secondary button3" 
              disabled
            >
              CANCELLED
            </button>
          ) : (
            <div className="button-box">
              <button
                type="button"
                className="btn btn-outline-primary button2 button5"
                onClick={() => handleClick('APPROVED')}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn btn-outline-primary button2 button5"
                onClick={() => handleClick('REJECTED')}
              >
                Reject
              </button>
            </div>
          )}
          <div className="arrow-icon" onClick={handleToggleResponses}>
            {showResponses ? '∧' : 'v'}
          </div>
        </div>
        <div className="status">{overAllLeaveStatus}</div>
      </div>

      {showResponses && (
        <div className="response-section manager-responses">
          <div className="leaveReason">{response.leaveRequest.leaveReason}</div>
          <div className="response-card response-inside">
            <div>{response.leaveRequest.leaveType}</div>
            <div className="date-box">
              <div className="date">{formatDate(response.leaveRequest.leaveStartDate)}</div>
              <div className="date">{formatDate(response.leaveRequest.leaveEndDate)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResponseCard;






