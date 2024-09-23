import React from 'react'

function LeaveForm({ handleSubmit, setFormData, formData, showModal, setShowModal }) {
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };
    return (
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
  )
}

export default LeaveForm;