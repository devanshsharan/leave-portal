import React, { useState, useEffect } from 'react';
import '../Css/LeaveCard.css';

function LeaveCard({ leave }) {
  const [managerResponses, setManagerResponses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResponses, setShowResponses] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    if (leave.status === 'CANCELLED') {
      setIsCancelled(true);
    } else {
      setIsCancelled(false);
    }
  }, [leave.status]); 

  const fetchManagerResponses = async (leaveRequestId) => {
    const token = localStorage.getItem('jwt');

    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/managerResponseList/${leaveRequestId}`, {
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

  const handleToggleResponses = () => {
    if (!showResponses) {
      fetchManagerResponses(leave.id);
    }
    setShowResponses(!showResponses);
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

  return (
    <div className="history-card">
      <div className="row1">
        <div className="leaveType">{leave.leaveType}</div>
        <div className="row11">
          <div className="date">{formatDate(leave.requestDate)}</div>
          {isCancelled ? (
            <button type="button" className="btn btn-secondary cancel-button" disabled>
              Cancelled
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-danger cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          <div className="arrow-icon" onClick={handleToggleResponses}>
            {showResponses ? '∧' : 'v'}
          </div>
        </div>
        <div className="status">{isCancelled ? 'CANCELLED' : leave.status}</div>
      </div>

      {showResponses && (
        <div className="response-section">
          {loading ? (
            <p>Loading manager responses...</p>
          ) : error ? (
            <p>{error}</p>
          ) : managerResponses.length > 0 ? (
            <div className="manager-responses">
              <div className="leaveReason">{leave.leaveReason}</div>
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
    </div>
  );
}

export default LeaveCard;




