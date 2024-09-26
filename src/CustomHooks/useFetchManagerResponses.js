import { useState, useCallback } from 'react';

const useFetchManagerResponses = () => {
    const [managerResponses, setManagerResponses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchManagerResponses = useCallback(async (leaveId) => {
        const token = localStorage.getItem('jwt');
        setLoading(true); 

        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/managerResponseList/${leaveId}`, {
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
            setError(null); 
        } catch (error) {
            console.error('Error fetching manager responses:', error);
            setError('Error fetching manager responses');
        } finally {
            setLoading(false);  
        }
    }, []); 

    return { managerResponses, error, loading, fetchManagerResponses };
};

export default useFetchManagerResponses;

