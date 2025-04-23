import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Alert, Modal, Table } from "flowbite-react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import MonacoEditor from "@monaco-editor/react";
import AchievementsBar from "../../components/achievements-bar/AchievementsBar";
import "./problemSet.css";

const ProblemSet = () => {
  const { user } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [selectedProblemSubmissions, setSelectedProblemSubmissions] = useState(
    []
  );
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [isAllSubmissionsModalOpen, setIsAllSubmissionsModalOpen] =
    useState(false);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axiosInstance.get("/problems");
        setProblems(response.data);

        const solvedCount = user?.solved_problems?.filter((problemId) =>
          response.data.some((problem) => problem._id === problemId)
        ).length;

        setSolvedCount(solvedCount);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserSubmissions = async (userId) => {
      try {
        const response = await axiosInstance.get(`/submissions/user/${userId}`);
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching user submissions:", error);
      }
    };

    fetchProblems();
    if (user) {
      fetchUserSubmissions(user._id);
    }
  }, [user]);

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

  const handleRowClick = (event) => {
    const problemId = event.data._id;
    navigate(`/problem/${problemId}`);
  };

  const handleShowMySubmissions = async (problemId) => {
    try {
        const userSubmissions = submissions
            .filter((sub) => sub.problem._id === problemId)
            .sort((a, b) => new Date(b.time) - new Date(a.time)); // Sort newest to oldest
        setSelectedProblemSubmissions(userSubmissions);
        setIsModalOpen(true);
    } catch (error) {
        console.error("Error fetching user submissions:", error);
    }
};

const handleShowAllSubmissions = async (problemId) => {
  try {
      const response = await axiosInstance.get(
          `/submissions/problem/${problemId}`
      );
      const sortedSubmissions = response.data.sort(
          (a, b) => new Date(b.time) - new Date(a.time) // Sort newest to oldest
      );
      setAllSubmissions(sortedSubmissions);
      setIsAllSubmissionsModalOpen(true);
  } catch (error) {
      console.error("Error fetching all submissions:", error);
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
      <div className="problems-table-container p-6">
      <h1 className="text-3xl font-semibold mb-6">Problem Set</h1>
        {/* Achievements Bar */}
        <AchievementsBar solvedCount={solvedCount} totalProblems={problems.length} />
        <DataTable
          value={problems}
          paginator
          rows={10}
          dataKey="_id"
          loading={loading}
          globalFilterFields={["name", "difficulty"]}
          header={header}
          emptyMessage="No problems found."
          rowClassName={rowClassName}
          onRowClick={handleRowClick}
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
                  onClick={() => handleShowMySubmissions(rowData._id)}
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

      {/* Modals for submissions */}
      {/* User Submissions Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>My Submissions</Modal.Header>
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
    </>
  );
};

export default ProblemSet;
