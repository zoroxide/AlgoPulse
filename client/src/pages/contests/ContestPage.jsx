import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Spinner, Alert, Button, Modal, Tabs } from 'flowbite-react';
import { HiClipboardList } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import axiosInstance from '../../utils/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import MonacoEditor from '@monaco-editor/react';
import AchievementsBar from '../../components/achievements-bar/AchievementsBar';
import '../../components/tables/UserTable.css';

const ContestPage = () => {
    const { user } = useContext(AuthContext);
    const { contestId } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [problems, setProblems] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [solvedCount, setSolvedCount] = useState(0);
    const [error, setError] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [selectedProblemSubmissions, setSelectedProblemSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const fetchContest = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get(`/contests/${contestId}`);
                setContest(response.data);
            } catch (err) {
                setError('Failed to load the contest. Please try again later.');
                console.error('Error fetching contest:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchContestProblems = async () => {
            try {
                const response = await axiosInstance.get(`/contests/${contestId}/problems`);
                setProblems(response.data);

                const solvedCount = user?.solved_problems?.filter((problemId) =>
                    response.data.some((problem) => problem._id === problemId)
                ).length;
            
                setSolvedCount(solvedCount);
            } catch (err) {
                setError('Failed to load the contest problems. Please try again later.');
                console.error('Error fetching contest problems:', err);
            }
        };

        const fetchLeaderboard = async () => {
            try {
                const response = await axiosInstance.get(`/contests/leaderboard/${contestId}`);
                const sortedLeaderboard = response.data.sort((a, b) => {
                    if (b.problemsSolved !== a.problemsSolved) {
                        return b.problemsSolved - a.problemsSolved;
                    }
                    return new Date(a.earliestAcceptedSubmission) - new Date(b.earliestAcceptedSubmission);
                });
                setLeaderboard(sortedLeaderboard);
            } catch (err) {
                setError('Failed to load the leaderboard. Please try again later.');
                console.error('Error fetching leaderboard:', err);
            }
        };

        const fetchUserSubmissions = async () => {
            try {
                const response = await axiosInstance.get(`/submissions/user/${user._id}`);
                setSubmissions(response.data);
            } catch (error) {
                console.error('Error fetching user submissions:', error);
            }
        };

        if (contestId && user) {
            fetchContest();
            fetchContestProblems();
            fetchLeaderboard();
            fetchUserSubmissions();
        }
    }, [contestId, user]);

    useEffect(() => {
        if (contest) {
            const interval = setInterval(() => {
                const currentTime = new Date();
                const startTime = new Date(contest.startTime);
                const endTime = new Date(contest.endTime);
                let timeDiff;

                if (currentTime < startTime) {
                    timeDiff = startTime - currentTime;
                } else if (currentTime < endTime) {
                    timeDiff = endTime - currentTime;
                } else {
                    timeDiff = 0;
                }

                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);

                if (timeDiff <= 0) {
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [contest]);

    const difficultyBodyTemplate = (rowData) => {
        const difficultyColors = {
            Hard: 'text-red-600',
            Medium: 'text-yellow-500',
            Easy: 'text-green-600',
        };
        return (
            <span className={difficultyColors[rowData.difficulty] || 'text-gray-700'}>
                {rowData.difficulty}
            </span>
        );
    };

    const submissionStatusTemplate = (rowData) => {
        const userSubmissions = submissions.filter(sub => sub.problem._id === rowData._id);
    
        if (userSubmissions.length > 0) {
            const lastSubmission = userSubmissions[userSubmissions.length - 1];
    
            // Check if the user is the first to solve the problem
            const firstAcceptedSubmission = submissions
                .filter(sub => sub.problem._id === rowData._id && sub.status === "Accepted")
                .sort((a, b) => new Date(a.time) - new Date(b.time))[0]; // Get the earliest accepted submission
    
            if (lastSubmission.status === "Accepted") {
                if (firstAcceptedSubmission && firstAcceptedSubmission.user._id === user._id) {
                    return <span className="text-blue-600">First Accepted 🎈🎈🎈</span>;
                }
                return <span className="text-green-600">Accepted 🎈</span>;
            }
    
            return <span className="text-red-600">Rejected ✘</span>;
        }
    
        return <span className="text-gray-600">No submissions made</span>;
    };

    const handleRowClick = (rowData) => {
        navigate(`/contest/${contestId}/problem/${rowData._id}`);
    };

    const handleShowSubmissions = async (problemId) => {
        try {
            const response = await axiosInstance.get(`/submissions/problem/${problemId}`);
            // setSubmissions(response.data);
            // const problemSubmissions = response.data.filter(sub => sub.problem._id === problemId);
            const sortedSubmissions = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
            setSelectedProblemSubmissions(sortedSubmissions);
            setSubmissions(sortedSubmissions);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching problem submissions:', error);
        }
    };

    const handleSubmissionClick = (submission) => {
        setSelectedSubmission(submission);
        setIsSubmissionModalOpen(true);
    };

    // const balloonsTemplate = (rowData) => {
    //     // Ensure rowData.submissions is defined
    //     if (!rowData.submissions || !Array.isArray(rowData.submissions)) {
    //         return ''; // Return no balloons if submissions are undefined or not an array
    //     }
    
    //     // Ensure only one balloon per solved problem
    //     const uniqueSolvedProblems = new Set(
    //         rowData.submissions
    //             .filter((submission) => submission.status === "Accepted")
    //             .map((submission) => submission.problemId)
    //     );
    //     return '🎈'.repeat(uniqueSolvedProblems.size);
    // };

    const rowClassName = (rowData) => {
        return rowData.user._id === user._id ? 'bg-green-100' : '';
    };

    const userTemplate = (rowData) => {
        return (
            <div className="flex items-center">
                <img
                    alt={`${rowData.user.username} avatar`}
                    src={rowData.user.avatar}
                    className="rounded-full h-8 w-8 mr-2"
                />
                <span>{rowData.user.username}</span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="xl" color="blue" />
            </div>
        );
    }

    if (error) {
        return <Alert color="failure">{error}</Alert>;
    }

    if (!contest) {
        return <Alert color="failure">Contest not found.</Alert>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">{contest?.name}</h1>
            <p className="text-lg mb-6">Time left: {timeLeft}</p>

            {/* Achievements Bar */}
            <AchievementsBar solvedCount={solvedCount} totalProblems={problems.length} />

            <Tabs aria-label="Tabs with underline" variant="underline">
                <Tabs.Item active title="Problems" icon={HiClipboardList}>
                    <h2 className="text-xl font-semibold mt-6 mb-4">Problems</h2>
                    <div className="problems-table-container p-6">
                        <DataTable
                            value={problems}
                            paginator
                            rows={10}
                            dataKey="_id"
                            loading={isLoading}
                            globalFilterFields={['name', 'difficulty']}
                            emptyMessage="No problems found."
                            onRowClick={(e) => handleRowClick(e.data)}
                            className="p-datatable-custom"
                        >
                            <Column field="name" header="Problem" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                            <Column
                                field="difficulty"
                                header="Difficulty"
                                body={difficultyBodyTemplate}
                                filter
                                filterPlaceholder="Search by difficulty"
                                style={{ minWidth: '12rem' }}
                            />
                            <Column
                                field="submissionStatus"
                                header="Last Submission Status"
                                body={submissionStatusTemplate}
                                style={{ minWidth: '12rem' }}
                            />
                            {user && user.isAdmin && (
                                <Column
                                    header="Actions"
                                    body={(rowData) => (
                                        <Button onClick={() => handleShowSubmissions(rowData._id)}>
                                            Show Submissions
                                        </Button>
                                    )}
                                    style={{ minWidth: '12rem' }}
                                />
                            )}
                        </DataTable>
                    </div>
                </Tabs.Item>
                <Tabs.Item title="Leaderboard" icon={MdDashboard}>
                    <h2 className="text-xl font-semibold mt-6 mb-4">Leaderboard</h2>
                    <div className="leaderboard-table-container p-6">
                        <DataTable
                            value={leaderboard}
                            paginator
                            rows={10}
                            dataKey="_id"
                            loading={isLoading}
                            globalFilterFields={['user.username']}
                            emptyMessage="No leaderboard entries found."
                            className="p-datatable-custom"
                            rowClassName={rowClassName}
                        >
                            <Column field="rank" header="Rank" body={(rowData, options) => options.rowIndex + 1} style={{ minWidth: '6rem' }} />
                            <Column field="user.username" header="User" body={userTemplate} filter filterPlaceholder="Search by username" style={{ minWidth: '12rem' }} />
                            <Column field="problemsSolved" header="Problems Solved" style={{ minWidth: '12rem' }} />
                            {/* <Column field="balloons" header="Balloons" body={balloonsTemplate} style={{ minWidth: '12rem' }} /> */}
                            <Column field="penalty" header="Penalty" body={(rowData, options) => rowData.problemsSolved * options.rowIndex + 1} style={{ minWidth: '12rem' }} />
                        </DataTable>
                    </div>
                </Tabs.Item>
            </Tabs>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Modal.Header>Submissions for Problem</Modal.Header>
                <Modal.Body>
                    <DataTable
                        value={selectedProblemSubmissions}
                        paginator
                        rows={10}
                        dataKey="_id"
                        loading={isLoading}
                        emptyMessage="No submissions found."
                        className="p-datatable-custom"
                    >
                        <Column field="user.username" header="User" style={{ minWidth: '12rem' }} />
                        <Column field="status" header="Status" body={(rowData) => rowData.status === "Accepted" ? 'Accepted' : 'Wrong Answer'} style={{ minWidth: '12rem' }} />
                        <Column field="time" header="Time" body={(rowData) => new Date(rowData.time).toLocaleString()} style={{ minWidth: '12rem' }} />
                        <Column field="failedTestcase" header="Test Case" body={(rowData) => rowData.failedTestcase !== null ? rowData.failedTestcase : 'N/A'} style={{ minWidth: '12rem' }} />
                        <Column header="Actions" body={(rowData) => (
                            <Button onClick={() => handleSubmissionClick(rowData)}>
                                View Code
                            </Button>
                        )} style={{ minWidth: '12rem' }} />
                    </DataTable>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={isSubmissionModalOpen} onClose={() => setIsSubmissionModalOpen(false)}>
                <Modal.Header>Submission Details</Modal.Header>
                <Modal.Body>
                    {selectedSubmission && (
                        <div>
                            <p><strong>User:</strong> {selectedSubmission.user.username}</p>
                            <p><strong>Time:</strong> {new Date(selectedSubmission.time).toLocaleString()}</p>
                            <p><strong>Status:</strong> {selectedSubmission.status === "Accepted" ? 'Accepted' : 'Wrong Answer'}</p>
                            <p><strong>Code:</strong></p>
                            <MonacoEditor
                                height="400px"
                                language="cpp"
                                theme='vs-dark'
                                value={selectedSubmission.code}
                                options={{ readOnly: true, theme: 'vs-dark' }}
                            />
                            <p><strong>Failed Testcase:</strong> {selectedSubmission.failedTestcase !== null ? selectedSubmission.failedTestcase : 'N/A'}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setIsSubmissionModalOpen(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ContestPage;