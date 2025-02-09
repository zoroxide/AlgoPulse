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
                setError("Failed to fetch contests data.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error happened: {error}</div>;
    }

    const currentTime = new Date();

    const upcomingContests = contests.filter(contest => new Date(contest.startTime) > currentTime);
    const runningContests = contests.filter(contest => new Date(contest.startTime) <= currentTime && new Date(contest.endTime) >= currentTime);
    const completedContests = contests.filter(contest => new Date(contest.endTime) < currentTime);

    return (
        <div className="explore-container">
            <div className="sheets-section">
                <h1 className="sheets-title">Contests</h1>
                <br />
                {upcomingContests.length > 0 && (
                    <>
                        <h2 className="sheets-subtitle">Upcoming Contests</h2>
                        {upcomingContests.map((contest) => (
                            <HomeCard
                                key={contest._id}
                                title={contest.name}
                                content={contest.description}
                                link={`/contest/${contest._id}`}
                                contestId={contest._id}
                                isUpcoming={true}
                            />
                        ))}
                    </>
                )}
                {runningContests.length > 0 && (
                    <>
                        <h2 className="sheets-subtitle">Running Now</h2>
                        {runningContests.map((contest) => (
                            <HomeCard
                                key={contest._id}
                                title={contest.name}
                                content={contest.description}
                                link={`/contest/${contest._id}`}
                                contestId={contest._id}
                                isRunning={true}
                            />
                        ))}
                    </>
                )}
                {completedContests.length > 0 && (
                    <>
                        <h2 className="sheets-subtitle">Completed Contests</h2>
                        {completedContests.map((contest) => (
                            <HomeCard
                                key={contest._id}
                                title={contest.name}
                                content={contest.description}
                                link={`/contest/${contest._id}`}
                                contestId={contest._id}
                                isCompleted={true}
                            />
                        ))}
                    </>
                )}
                {contests.length === 0 && (
                    <Alert>No Contest Found</Alert>
                )}
            </div>
        </div>
    );
};

export default Contests;