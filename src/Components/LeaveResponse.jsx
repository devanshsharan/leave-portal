import React, { useState, useEffect } from 'react';
import ResponseCard from '../RightContent/ResponseCard';
import Pagination from '../RightContent/Pagination';
import '../Css/LeaveResponse.css';
import { useSelector, useDispatch } from 'react-redux'; 
import { selectCurrentEmployeeId, selectCurrentToken, logOut } from '../features/auth/authSlice';
import useFetchInterceptor from '../CustomHooks/useFetchInterceptor';
import { clearLeaveRequestId } from '../features/auth/leaveSlice';

function LeaveResponse() {
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const managerId = useSelector(selectCurrentEmployeeId);
    const token = useSelector(selectCurrentToken);
    const fetchWithInterceptor = useFetchInterceptor();
    const dispatch = useDispatch();
    const leaveRequestId = useSelector((state) => state.leave.leaveRequestId);

    useEffect(() => {
        const fetchResponses = async () => {

            if (!token) {
                setError('No token found. Please login.');
                setLoading(false);
                return;
            }

            if (!managerId) {
                setError('No manager ID found.');
                setLoading(false);
                return;
            }

            try {
                const requestsUrl = leaveRequestId
                    ? `http://localhost:8081/manager/${managerId}/${offset}/${pageSize}?leaveRequestId=${leaveRequestId}`
                    : `http://localhost:8081/manager/${managerId}/${offset}/${pageSize}`;

                const response = await fetchWithInterceptor(requestsUrl, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                       
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 204) {
                    setResponses([]);
                } else if (!response.ok) {
                    throw new Error('Failed to fetch leave responses.');
                } else {
                    const data = await response.json();
                    setResponses(data.content);
                    setTotalPages(data.totalPages);
                    setError(null);
                }
            } catch (error) {
                setError('Error fetching leave responses.');
                console.error('Error:', error);
            } finally {
                setLoading(false);
                if (leaveRequestId) {
                    dispatch(clearLeaveRequestId());
                }
            }
        };

        fetchResponses();
    }, [offset, pageSize, managerId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="responselayout">

            {responses.length > 0 ? (
                <div>
                    <div className="history-columns">
                        {responses.map((response) => (
                            <ResponseCard key={response.id} response={response} />
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
                <p>No response history available.</p>
            )}
        </div>
    );
}

export default LeaveResponse;

