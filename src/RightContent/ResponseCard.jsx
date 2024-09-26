import React, { useEffect, useState } from 'react';
import '../Css/ResponseCard.css';
import useFetchManagerResponses from '../CustomHooks/useFetchManagerResponses';
import { GiSandsOfTime } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";
import { GiSkullCrossedBones } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";
import { FaAnglesDown,FaAnglesUp } from "react-icons/fa6";

function ResponseCard({ response }) {
  const [showResponses, setShowResponses] = useState(false);
  const [isResponseChanged, setIsResponseChanged] = useState(response.response);
  const [overAllLeaveStatus, setOverAllLeaveStatus] = useState(response.leaveRequest.status);
  const [comment, setComment] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('jwt');
      const managerId = localStorage.getItem('employeeId');
      const employeeId = response.leaveRequest.employee.id;
      console.log(response);
      console.log(employeeId);

      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const fetchResponse = await fetch(
          `http://localhost:8081/managerEmployeeProjects/${managerId}/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        if (!fetchResponse.ok) {
          throw new Error(`Error: ${fetchResponse.statusText}`);
        }

        const data = await fetchResponse.json();
        setProjects(data);  
      } catch (err) {
        console.error('Error fetching projects:', err.message);
      }
    };

    fetchProjects();
  }, [response.leaveRequest.employeeId]);

  const { managerResponses, error, loading, fetchManagerResponses } = useFetchManagerResponses();

  useEffect(() => {
    if (response.leaveRequest.id) {
        fetchManagerResponses(response.leaveRequest.id);
    }
  }, [isResponseChanged, fetchManagerResponses]);

  const handleInputChange = (e) => {
    setComment(e.target.value); 
  };

  const handleClick = async (status) => {
    const token = localStorage.getItem('jwt');
    const employeeId = localStorage.getItem('employeeId');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const finalComment = comment.trim() === '' ? 'No Comments' : comment;
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
          comments: finalComment,
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
                className="btn btn-outline-primary button2"
                onClick={() => handleClick('PENDING')}
                disabled={isResponseChanged === "CANCELLED"}
              >
                Change Your Response
              </button>
            </div>
          ) : (
            <div>
              <input className="input-box" type="text" value={comment} onChange={handleInputChange} disabled={isResponseChanged === "CANCELLED"} placeholder="Enter your comment" />
              <div className="button-box">
                <button
                  type="button"
                  className="btn btn-primary button2 button5"
                  onClick={() => handleClick('APPROVED')}
                  disabled={isResponseChanged === "CANCELLED"}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger button2 button5"
                  onClick={() => handleClick('REJECTED')}
                  disabled={isResponseChanged === "CANCELLED"}
                >
                  Reject
                </button>
              </div>
            </div>
          )}
          <div className="arrow-icon" onClick={handleToggleResponses}>
          {showResponses ? <FaAnglesUp /> : <FaAnglesDown />}
          </div>
        </div>
        <div className="status-boxi">
          <div className="status-boxi1">
            <div className="status-size">Response: </div>
            <div className={`icons-design status ${isResponseChanged.toLowerCase()}`}>
               <span className="boxi-status ">
                   {isResponseChanged}
               </span>
               <span>
                   {getResponseIcon(isResponseChanged)}
               </span>
            </div>            
          </div>
          <div className="status-boxi1">
            <div className="status-size">Status: </div>
            <div className={`icons-design status ${overAllLeaveStatus.toLowerCase()}`}>
               <span className="boxi-status">
                   {overAllLeaveStatus}
               </span>
               <span>
                   {getResponseIcon(overAllLeaveStatus)}
               </span>
            </div>
            </div>
        </div>
      </div>

      {showResponses && (
        <div className="big-bulkha">
          <div className="boxi-leavereason-box">
            <div className="leave-heading">Leave Reason:</div>
            <div>{response.leaveRequest.leaveReason}</div>
          </div>
        <div className="boxi1">
            <div className="boxi2 boxic">
              <div>
                {response.leaveRequest.leaveStartDate === response.leaveRequest.leaveEndDate ? (
                  formatDate(response.leaveRequest.leaveStartDate)
                ) : (
                  `${formatDate(response.leaveRequest.leaveStartDate)} - ${formatDate(response.leaveRequest.leaveEndDate)}`
                )}
              </div>
              <div>
                {response.leaveRequest.leaveType}
              </div>
            </div>
            <div className="boxi3 boxic">
                <h6 className="approval-heading">Approval Status:</h6>
                {managerResponses
                  .filter((resItem) => response.manager.id !== resItem.manager.id)  
                  .map((res) => (
                    <div className="boxi4" key={res.id}>
                      <div className="boxi-name">{res.manager.name.split(' ')[0]}</div>
                      <div className={`icons-design status ${res.response.toLowerCase()}`}>
                        <span className="boxi-status">
                          {res.response}
                        </span>
                        <span>
                          {getResponseIcon(res.response)}
                        </span>
                      </div>
                    </div>
                  ))
                }
            </div>
            <div className="boxi5 boxic">
              <h6 className="project-heading">Projects</h6>
              {projects.length === 0 ? (
                <p>No projects found</p>
              ) : (
                <ul className="project-list">
                  {projects.map((project) => (
                    <div key={project.id}>
                      {project.project.name} 
                    </div>
                  ))}
                </ul>
              )}
            </div>
        </div>
        </div>
      )}
    </div>
  );
}

export default ResponseCard;






