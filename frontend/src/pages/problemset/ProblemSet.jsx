import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Alert, Modal } from 'flowbite-react';
import axiosInstance from '../../utils/axiosInstance';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Table } from 'flowbite-react';

const getUserData = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("admin panel error: no token found");
            throw new Error('No token found. Please log in.');
        }
        const apiUrl = 'http://localhost:3000/api/get-user';
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

const ProblemSet = () => {
    const { user } = useContext(AuthContext);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [selectedProblemSubmissions, setSelectedProblemSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await axiosInstance.get('/problems');
                setProblems(response.data);
            } catch (error) {
                console.error('Error fetching problems:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserSubmissions = async () => {
            try {
                const userData = await getUserData();
                const response = await axios.get(`http://localhost:3000/api/submissions/user/${userData._id}`);
                setSubmissions(response.data);
            } catch (error) {
                console.error('Error fetching user submissions:', error);
            }
        };

        fetchProblems();
        fetchUserSubmissions();
    }, []);

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
        const submission = submissions.find(sub => sub.problem._id === rowData._id);
        if (submission) {
            return submission.accepted ? (
                <span className="text-green-600">Accepted ✔</span>
            ) : (
                <span className="text-red-600">Rejected ✘</span>
            );
        }
        return null;
    };

    const handleRowClick = (rowData) => {
        navigate(`/problem/${rowData._id}`);
    };

    const handleShowSubmissions = async (problemId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/submissions/problem/${problemId}`);
            setSelectedProblemSubmissions(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching problem submissions:', error);
        }
    };

    const handleSubmissionClick = (submission) => {
        setSelectedSubmission(submission);
        setIsSubmissionModalOpen(true);
    };

    const header = (
        <div className="table-header flex justify-between items-center">
            <span>List of Problems</span>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="xl" color="blue" />
            </div>
        );
    }

    if (!problems || problems.length === 0) {
        return <Alert color="failure">No problems available.</Alert>;
    }

    return (
        <>
            <h1 className="text-3xl font-semibold mb-6">Problem Set</h1>
            <div className="problems-table-container p-6">
                <DataTable
                    value={problems}
                    paginator
                    rows={10}
                    dataKey="_id"
                    filters={filters}
                    loading={loading}
                    globalFilterFields={['name', 'difficulty']}
                    header={header}
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

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Modal.Header>Submissions for Problem</Modal.Header>
                <Modal.Body>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>User</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {selectedProblemSubmissions.map((submission) => (
                                <Table.Row key={submission._id}>
                                    <Table.Cell>{submission.user.username}</Table.Cell>
                                    <Table.Cell>{submission.accepted ? 'Accepted' : 'Rejected'}</Table.Cell>
                                    <Table.Cell>
                                        <Button onClick={() => handleSubmissionClick(submission)}>
                                            View Details
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
                            <p><strong>Problem:</strong> {selectedSubmission.problem.name}</p>
                            <p><strong>Time:</strong> {new Date(selectedSubmission.time).toLocaleString()}</p>
                            <p><strong>Status:</strong> {selectedSubmission.accepted ? 'Accepted' : 'Rejected'}</p>
                            <p><strong>Code:</strong></p>
                            <pre>{selectedSubmission.code}</pre>
                            <p><strong>Failed Testcase:</strong> {selectedSubmission.failedTestcase !== null ? selectedSubmission.failedTestcase : 'N/A'}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setIsSubmissionModalOpen(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProblemSet;