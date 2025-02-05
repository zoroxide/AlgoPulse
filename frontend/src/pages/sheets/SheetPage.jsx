import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Spinner, Alert, Button, Modal, Table } from 'flowbite-react';
import axiosInstance from '../../utils/axiosInstance';
import { AuthContext } from '../../context/AuthContext';

const getUserData = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("admin panel error: no token found");
            throw new Error('No token found. Please log in.');
        }
        const response = await axiosInstance.get('/get-user', {
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

const SheetPage = () => {
    const { user } = useContext(AuthContext);
    const { sheetId } = useParams();
    const navigate = useNavigate();

    const [sheet, setSheet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [selectedProblemSubmissions, setSelectedProblemSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

    useEffect(() => {
        const fetchSheet = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get(`sheets/${sheetId}`);
                setSheet(response.data);
            } catch (err) {
                setError('Failed to load the sheet. Please try again later.');
                console.error('Error fetching sheet:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchUserSubmissions = async () => {
            try {
                const userData = await getUserData();
                const response = await axiosInstance.get(`/submissions/user/${userData._id}`);
                setSubmissions(response.data);
            } catch (error) {
                console.error('Error fetching user submissions:', error);
            }
        };

        if (sheetId) {
            fetchSheet();
            fetchUserSubmissions();
        }
    }, [sheetId]);

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
            const response = await axiosInstance.get(`/submissions/problem/${problemId}`);
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

    if (!sheet) {
        return <Alert color="failure">Sheet not found.</Alert>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-4">{sheet.title}</h1>
            <p className="text-lg mb-6">{sheet.description}</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">Problems</h2>

            <div className="problems-table-container p-6">
                <DataTable
                    value={sheet.problems}
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
        </div>
    );
};

export default SheetPage;