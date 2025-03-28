import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spinner, Alert, Button, Modal, Table } from "flowbite-react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import MonacoEditor from "@monaco-editor/react";
import "./SheetPage.css";

const SheetPage = () => {
  const { user } = useContext(AuthContext);
  const { sheetId } = useParams();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [isAllSubmissionsModalOpen, setIsAllSubmissionsModalOpen] =
    useState(false);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [selectedProblemSubmissions, setSelectedProblemSubmissions] = useState(
    []
  );
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axiosInstance.get(`/sheets/${sheetId}/problems`);
        setProblems(response.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserSubmissions = async () => {
      try {
        const response = await axiosInstance.get(
          `/submissions/user/${user._id}`
        );
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching user submissions:", error);
      }
    };

    fetchProblems();
    if (user) {
      fetchUserSubmissions();
    }
  }, [sheetId, user]);

  const difficultyBodyTemplate = (rowData) => {
    const difficultyColors = {
      Hard: "text-red-600",
      Medium: "text-yellow-500",
      Easy: "text-green-600",
    };
    return (
      <span className={difficultyColors[rowData.difficulty] || "text-gray-700"}>
        {rowData.difficulty}
      </span>
    );
  };

//   const submissionStatusTemplate = (rowData) => {
//     const userSubmissions = submissions.filter(
//       (sub) => sub.problem._id === rowData._id
//     );
//     if (userSubmissions.length > 0) {
//       const lastSubmission = userSubmissions[userSubmissions.length - 1];
//       return lastSubmission.status === "Accepted" ? (
//         <span className="text-green-600">Accepted ✔</span>
//       ) : (
//         <span className="text-red-600">Rejected ✘</span>
//       );
//     }
//     return <span className="text-gray-600">No submissions made</span>;
//   };

  const rowClassName = (rowData) => {
    const userSubmissions = submissions.filter(
      (sub) => sub.problem._id === rowData._id
    );
    if (userSubmissions.length > 0) {
      const lastSubmission = userSubmissions[userSubmissions.length - 1];
      switch (lastSubmission.status) {
        case "Accepted":
          return "bg-green-100 hover:bg-green-200 cursor-pointer";
        case "Rejected":
          return "bg-red-100 hover:bg-red-200 cursor-pointer";
        case "Error":
          return "bg-gray-100 hover:bg-gray-200 cursor-pointer";
        case "Time Limit Exceeded":
          return "bg-blue-100 hover:bg-blue-200 cursor-pointer";
        default:
          return "hover:bg-gray-100 cursor-pointer";
      }
    }
    return "hover:bg-gray-100 cursor-pointer";
  };

  const handleRowClick = (rowData) => {
    navigate(`/problem/${rowData._id}`);
  };

  const handleShowSubmissions = async (problemId) => {
    try {
      const response = await axiosInstance.get(
        `/submissions/problem/${problemId}`
      );
      setSelectedProblemSubmissions(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleShowAllSubmissions = async (problemId) => {
    try {
      const response = await axiosInstance.get(
        `/submissions/problem/${problemId}`
      );
      setAllSubmissions(response.data);
      setIsAllSubmissionsModalOpen(true);
    } catch (error) {
      console.error("Error fetching all submissions:", error);
    }
  };

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    setIsSubmissionModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" color="blue" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Sheet Problems</h1>
      <div className="problems-table-container p-6">
        <DataTable
          value={problems}
          paginator
          rows={10}
          dataKey="_id"
          loading={loading}
          globalFilterFields={["name", "difficulty"]}
          emptyMessage="No problems found."
          rowClassName={rowClassName}
          onRowClick={(e) => handleRowClick(e.data)}
          className="p-datatable-custom"
        >
          <Column
            field="name"
            header="Problem"
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="difficulty"
            header="Difficulty"
            body={difficultyBodyTemplate}
            filter
            filterPlaceholder="Search by difficulty"
            style={{ minWidth: "12rem" }}
          />
          <Column
            header="Actions"
            body={(rowData) => (
              <div className="flex space-x-2">
                <Button
                  color="info"
                  onClick={() => handleShowSubmissions(rowData._id)}
                >
                  My Submissions
                </Button>
              </div>
            )}
            style={{ minWidth: "16rem" }}
          />
          {user?.isAdmin && (
            <Column
              header="Admin Actions"
              body={(rowData) => (
                <Button onClick={() => handleShowAllSubmissions(rowData._id)}>
                  All Submissions
                </Button>
              )}
              style={{ minWidth: "12rem" }}
            />
          )}
        </DataTable>
      </div>

      {/* User Submissions Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Submissions for Problem</Modal.Header>
        <Modal.Body>
          <Table>
            <Table.Head>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Time</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {selectedProblemSubmissions.map((submission) => (
                <Table.Row
                  key={submission._id}
                  className={
                    submission.status === "Accepted"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }
                >
                  <Table.Cell>{submission.status}</Table.Cell>
                  <Table.Cell>
                    {new Date(submission.time).toLocaleString()}
                  </Table.Cell>
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

      {/* Admin Submissions Modal */}
      <Modal
        show={isAllSubmissionsModalOpen}
        onClose={() => setIsAllSubmissionsModalOpen(false)}
      >
        <Modal.Header>All Submissions</Modal.Header>
        <Modal.Body>
          <Table>
            <Table.Head>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Time</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {allSubmissions.map((submission) => (
                <Table.Row
                  key={submission._id}
                  className={
                    submission.status === "Accepted"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }
                >
                  <Table.Cell>{submission.user.name}</Table.Cell>
                  <Table.Cell>{submission.status}</Table.Cell>
                  <Table.Cell>
                    {new Date(submission.time).toLocaleString()}
                  </Table.Cell>
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
          <Button onClick={() => setIsAllSubmissionsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Submission Details Modal */}
      <Modal
        show={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
      >
        <Modal.Header>Submission Details</Modal.Header>
        <Modal.Body>
          {selectedSubmission && (
            <div>
              <p>
                <strong>Problem:</strong> {selectedSubmission.problem.name}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(selectedSubmission.time).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedSubmission.status}
              </p>
              <p>
                <strong>Code:</strong>
              </p>
              <MonacoEditor
                height="400px"
                language="cpp"
                theme="vs-dark"
                value={selectedSubmission.code}
                options={{ readOnly: true }}
              />
              <p>
                <strong>Failed Testcase:</strong>{" "}
                {selectedSubmission.failedTestcase || "N/A"}
              </p>
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
