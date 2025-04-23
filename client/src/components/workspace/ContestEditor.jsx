import { Button } from "flowbite-react";
import React, { useState, useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import MonacoEditor from "@monaco-editor/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import templates from "../../templates.json";
import axiosInstance from "../../utils/axiosInstance";
import { Modal } from "flowbite-react";
import { AuthContext } from '../../context/AuthContext';

const ContestEditor = ({ problem, contest}) => {
  const { user } = useContext(AuthContext);
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(templates[language].template);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");

  const languageMap = {
    cpp: "cpp",
    java: "java",
    py: "python",
    c: "c",
    go: "go",
    cs: "csharp",
    js: "javascript",
  };

  const handleThemeToggle = () => {
    setTheme(theme === "vs-dark" ? "vs-light" : "vs-dark");
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(templates[lang].template);
  };

  const handleRunAllTestCases = async () => {
    if (!problem || !problem.testcases || problem.testcases.length === 0) {
      toast.error("No test cases available for this problem.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/compile/contest", {
        userID: user._id,
        problemID: problem._id,
        contestID: contest,
        code,
        language,
      });

      if (response.data && response.data.status) {
        setSubmissionStatus(response.data.status);
      } else {
        console.error("Unexpected response format:", response.data);
        setSubmissionStatus("Error");
      }
    } catch (error) {
      console.error("Error running all test cases:", error);
      setSubmissionStatus("Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-between p-2 bg-gray-800 text-white">
        <select
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white"
          value={language}
        >
          {Object.keys(templates).map((key) => (
            <option key={key} value={key}>
              {templates[key].name}
            </option>
          ))}
        </select>

        <Button onClick={handleThemeToggle} color="dark">
          {theme === "vs-dark" ? <FaSun /> : <FaMoon />}
        </Button>
      </div>

      {/* Monaco Editor */}
      <MonacoEditor
        height="90%"
        language={languageMap[language]}
        theme={theme}
        value={code}
        onChange={(newValue) => setCode(newValue)}
      />

      {/* Submit Button */}
      <div className="flex justify-end gap-2 p-2 bg-gray-800 text-white">
        <Button onClick={handleRunAllTestCases} color="green" size="md" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>

      {/* Submission Status Modal */}
      <Modal show={submissionStatus !== ""} onClose={() => setSubmissionStatus("")}>
        <Modal.Header>Submission Status</Modal.Header>
        <Modal.Body>
          <p className={submissionStatus === "Accepted" ? "text-green-600 font-bold" : "text-red-600"}>
            {submissionStatus === "Accepted" ? "Accepted 🎈" : "Wrong Answer"}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setSubmissionStatus("")}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ContestEditor;