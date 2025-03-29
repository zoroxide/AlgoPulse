import React, { useContext, useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Label,
  TextInput,
  Button,
  Modal,
  Badge,
} from "flowbite-react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import MonacoEditor from "@monaco-editor/react";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [imageLink, setImageLink] = useState(user?.avatar || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [codeforcesHandle, setCodeforcesHandle] = useState(
    user?.cf_handle || ""
  );
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [totalSolvedProblems, setTotalSolvedProblems] = useState(0);
  const [lineChartData, setLineChartData] = useState(null);
  const [lineChartOptions, setLineChartOptions] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSubmissions = async (userId) => {
      try {
        const response = await axiosInstance.get(`/submissions/user/${userId}`);
        const sortedSubmissions = response.data.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        setSubmissions(sortedSubmissions);
      } catch (error) {
        console.error("Error fetching user submissions:", error);
      }
    };

    const fetchSolvedProblems = async (userId) => {
      try {
        const response = await axiosInstance.get(
          `/users/${userId}/solved-problems`
        );
        const solved = { easy: 0, medium: 0, hard: 0 };
        response.data.forEach((problem) => {
          if (problem.difficulty === "Easy") solved.easy += 1;
          if (problem.difficulty === "Medium") solved.medium += 1;
          if (problem.difficulty === "Hard") solved.hard += 1;
        });
        setSolvedProblems(solved);
        setTotalSolvedProblems(response.data.length);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    if (user) {
      setName(user.name);
      setImageLink(user.avatar);
      setPhone(user.phone);
      setCodeforcesHandle(user.cf_handle);
      fetchUserSubmissions(user._id);
      fetchSolvedProblems(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (submissions.length > 0) {
      const submissionsByDate = submissions.reduce((acc, submission) => {
        const date = new Date(submission.time).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(submissionsByDate).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      const data = labels.map((label) => submissionsByDate[label]);

      setLineChartData({
        labels,
        datasets: [
          {
            label: "Submissions",
            data,
            borderColor: "#42A5F5",
            backgroundColor: "rgba(66, 165, 245, 0.2)",
            tension: 0.4,
          },
        ],
      });

      setLineChartOptions({
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Submissions Over Time",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Number of Submissions",
            },
            beginAtZero: true,
          },
        },
      });
    }
  }, [submissions]);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProblemClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const getBadge = (score) => {
    if (score < 50) return "Beginner";
    if (score <= 100) return "Survival";
    if (score <= 200) return "Veteran";
    return "Expert";
  };

  const pieChartData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [solvedProblems.easy, solvedProblems.medium, solvedProblems.hard],
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Solved Problems by Difficulty",
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <div className="flex items-center space-x-4">
          <Avatar img={user.avatar} size="xl" />
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p>Name: {user.name || "No Name Provided"}</p>
            <p>Email: {user.email || "No email available"}</p>
            <p>Phone Number: {user.phone || "No phone available"}</p>
            <p>Codeforces Handle: {user.cf_handle || "No Codeforces handle"}</p>
            <p>Role: {user.isAdmin ? "Admin" : "User"}</p>
            <h3>Solved Problems: {totalSolvedProblems}</h3>
            <p>Score: {user.score}</p>
            <Badge color="info">{getBadge(user.score)}</Badge>
          </div>
        </div>
        <Button className="mt-4" onClick={handleEditProfile}>
          Edit Profile
        </Button>
      </Card>

      <Card className="mt-4">
        <h3 className="text-lg font-bold mb-4">
          Solved Problems by Difficulty
        </h3>
        <div
          style={{
            width: "100%",
            maxWidth: "300px",
            height: "300px",
            margin: "0 auto",
          }}
        >
          <Chart type="pie" data={pieChartData} options={pieChartOptions} />
        </div>
      </Card>

      <Card className="mt-4">
        <h3 className="text-lg font-bold mb-4">Submissions Over Time</h3>
        <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>
          <Chart
            type="line"
            data={lineChartData}
            options={{
              ...lineChartOptions,
              maintainAspectRatio: false, // Disable aspect ratio to control height
            }}
            style={{ height: "400px" }} // Seting a fixed height for the chart
          />
        </div>
      </Card>

      <Card className="mt-4">
        <h2 className="text-xl font-bold mb-4">Submissions</h2>
        <DataTable
          value={submissions}
          paginator
          rows={10}
          dataKey="_id"
          emptyMessage="No submissions found."
          className="p-datatable-custom"
        >
          <Column
            field="problem.name"
            header="Problem Name"
            body={(rowData) => (
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleProblemClick(rowData.problem._id)}
              >
                {rowData.problem.name}
              </button>
            )}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="time"
            header="Time"
            body={(rowData) => new Date(rowData.time).toLocaleString()}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="status"
            header="Status"
            body={(rowData) => (
              <span
                className={
                  rowData.status === "Accepted"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {rowData.status === "Accepted" ? "Accepted" : "Wrong Answer"}
              </span>
            )}
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="failedTestcase"
            header="Failed Testcase"
            body={(rowData) =>
              rowData.failedTestcase !== null ? (
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleSubmissionClick(rowData)}
                >
                  {rowData.failedTestcase}
                </button>
              ) : (
                "N/A"
              )
            }
            style={{ minWidth: "10rem" }}
          />
          <Column
            header="Actions"
            body={(rowData) => (
              <Button size="xs" onClick={() => handleSubmissionClick(rowData)}>
                View Code
              </Button>
            )}
            style={{ minWidth: "10rem" }}
          />
        </DataTable>
      </Card>

      <Modal show={isModalOpen} onClose={handleCloseModal}>
        <Modal.Header>Submission Details</Modal.Header>
        <Modal.Body>
          {selectedSubmission && (
            <div>
              <p>
                <strong>User:</strong>{" "}
                {selectedSubmission.user?.username || "Unknown"}
              </p>
              <p>
                <strong>Problem:</strong> {selectedSubmission.problem.name}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(selectedSubmission.time).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedSubmission.status === "Accepted"
                  ? "Accepted"
                  : "Wrong Answer"}
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
                {selectedSubmission.failedTestcase !== null
                  ? selectedSubmission.failedTestcase
                  : "N/A"}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
