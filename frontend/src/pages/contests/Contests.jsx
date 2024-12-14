import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './Contests.css';
import { Alert } from 'flowbite-react';
import HomeCard from '../../components/cards/HomeCard';

const Contests = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosInstance.get('/contests')
            .then((response) => {
                setContests(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("Failed to fetch sheets data.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>error happend: {error}</div>;
    }

    return (
        <div className="explore-container">
            <div className="sheets-section">
                <h1 className="sheets-title">Contests</h1>
                <br />
                {contests.length === 0 ? (
                    <Alert>No Contest Found</Alert>
                ) : (
                    contests.map((contest) => (
                        <HomeCard
                            key={contest._id}
                            title={contest.name}
                            content={contest.description}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Contests;