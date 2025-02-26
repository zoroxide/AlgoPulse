import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Spinner, Alert, Button, Modal, Table, Tabs } from 'flowbite-react';
import { HiClipboardList } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import axiosInstance from '../../utils/axiosInstance';
import { AuthContext } from '../../context/AuthContext';

const ContestPage = () => {
    const { user } = useContext(AuthContext);
    const { contestId } = useParams();
    const navigate = useNavigate();

    const [contest, setContest] = useState(null);
    const [problems, setProblems] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
                setError('Failed to load the contest. Please try again later, contest page');
                console.error('Error fetching contest:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchContestProblems = async () => {
            try {
                const response = await axiosInstance.get(`/contests/${contestId}/problems`);
                setProblems(response.data);
            } catch (err) {
                setError('Failed to load the contest problems. Please try again later.');
                console.error('Error fetching contest problems:', err);
            }
        };

        const fetchLeaderboard = async () => {
            try {
                const response = await axiosInstance.get(`/contests/leaderboard/${contestId}`);
                setLeaderboard(response.data);
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
            return lastSubmission.accepted ? (
                <span className="text-green-600">Accepted ✔</span>
            ) : (
                <span className="text-red-600">Rejected ✘</span>
            );
        }
        return null;
    };

    const handleRowClick = (rowData) => {
        navigate(`/contest/${contestId}/problem/${rowData._id}`);
    };

    const handleShowSubmissions = async (problemId) => {
        try {
            const response = await axiosInstance.get(`/submissions/problem/${problemId}`);
            const sortedSubmissions = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
            setSelectedProblemSubmissions(sortedSubmissions);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching problem submissions:', error);
        }
    };

    const handleSubmissionClick = (submission) => {
        setSelectedSubmission(submission);
        setIsSubmissionModalOpen(true);
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
            <p className="text-lg mb-6">Time left: {timeLeft}</p>

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
                                header="Submission Status"
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
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Rank</Table.HeadCell>
                                <Table.HeadCell>User</Table.HeadCell>
                                <Table.HeadCell>Problems Solved</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {leaderboard.map((entry, index) => (
                                    <Table.Row key={entry.user._id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{entry.user.username}</Table.Cell>
                                        <Table.Cell>{entry.problemsSolved}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </Tabs.Item>
            </Tabs>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Modal.Header>Submissions for Problem</Modal.Header>
                <Modal.Body>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>User</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                            <Table.HeadCell>Time</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {selectedProblemSubmissions.map((submission) => (
                                <Table.Row key={submission._id} className={submission.accepted ? 'bg-green-100' : 'bg-red-100'}>
                                    <Table.Cell>{submission.user.username}</Table.Cell>
                                    <Table.Cell>{submission.accepted ? 'Accepted' : 'Rejected'}</Table.Cell>
                                    <Table.Cell>{new Date(submission.time).toLocaleString()}</Table.Cell>
                                    <Table.Cell>
                                        <Button onClick={() => handleSubmissionClick(submission)}>
                                            View Code
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
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
                            <p><strong>Status:</strong> {selectedSubmission.accepted ? 'Accepted' : 'Rejected'}</p>
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