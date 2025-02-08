import { Button } from "flowbite-react";
import React, { useState, useContext } from "react";
import { FaPlay, FaMoon, FaSun } from "react-icons/fa";
import MonacoEditor from "@monaco-editor/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import templates from "../../../templates.json";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { Modal } from "flowbite-react";
import { AuthContext } from '../../../context/AuthContext';

const CodeEditor = ({ problem }) => {
  const { user } = useContext(AuthContext);
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(templates[language].template);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleThemeToggle = () => {
    setTheme(theme === "vs-dark" ? "vs-light" : "vs-dark");
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(templates[lang].template);
  };

  const handleRunFirstTestCase = async () => {
    if (!problem || !problem.testcases || problem.testcases.length === 0) {
      toast.error("No test cases available for this problem.");
      return;
    }
  
    setIsLoading(true);
    setOpenModal(true);
  
    try {
      const testCase = problem.testcases[0];
      const response = await axios.post("http://localhost:8080/", {
        code,
        language,
        input: testCase.inputs.join("\n"),
      });
  
      const actualOutput = response.data.output.trim();
      const expectedOutput = testCase.outputs[0].trim();
  
      setTestResults([
        {
          input: testCase.inputs.join("\n"),
          expectedOutput,
          actualOutput,
          passed: actualOutput === expectedOutput,
        },
      ]);
    } catch (error) {
      console.error("Error executing test case:", error);
      setTestResults([
        {
          input: problem.testcases[0].inputs.join("\n"),
          expectedOutput: problem.testcases[0].outputs[0].trim(),
          actualOutput: "Error during execution",
          passed: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleRunAllTestCases = async () => {
    if (!problem || !problem.testcases || problem.testcases.length === 0) {
        toast.error("No test cases available for this problem.");
        return;
    }

    setIsLoading(true);
    setTestResults([]);
    setOpenModal(true);

    try {
        const results = await Promise.all(
            problem.testcases.map(async (testCase) => {
                try {
                    const response = await axios.post("http://localhost:8080/", {
                        code,
                        language,
                        input: testCase.inputs.join("\n"),
                    });

                    const actualOutput = response.data.output.trim();
                    const expectedOutput = testCase.outputs[0].trim();

                    return {
                        input: testCase.inputs.join("\n"),
                        expectedOutput,
                        actualOutput,
                        passed: actualOutput === expectedOutput,
                    };
                } catch (error) {
                    console.error("Error executing test case:", error);
                    return {
                        input: testCase.inputs.join("\n"),
                        expectedOutput: testCase.outputs[0].trim(),
                        actualOutput: "Error during execution",
                        passed: false,
                    };
                }
            })
        );

        const allPassed = results.every(result => result.passed);

        // Save submission
        await axiosInstance.post("/submissions/create", {
            user: user._id,
            problem: problem._id,
            time: Date.now(),
            code,
            accepted: allPassed,
            failedTestcase: allPassed ? null : results.findIndex(result => !result.passed),
        });

        setTestResults(results);
    } catch (error) {
        console.error("Error running all test cases:", error);
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
        language={language}
        theme={theme}
        value={code}
        onChange={(newValue) => setCode(newValue)}
      />

      {/* Run Buttons */}
      <div className="flex justify-end gap-2 p-2 bg-gray-800 text-white">
        <Button onClick={handleRunFirstTestCase} color="dark" size="md" disabled={isLoading}>
          {isLoading ? "Running..." : <><FaPlay className="mr-2" /> Run</>}
        </Button>
        <Button onClick={handleRunAllTestCases} color="green" size="md" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>

      {/* Test Case Results Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Test Case Results</Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {testResults.map((result, index) => (
                <div key={index} className="p-2 border-b">
                  <p className="text-sm text-gray-700">Test Case {index + 1}:</p>
                  <p className="text-sm text-gray-500">Input: {result.input}</p>
                  <p className="text-sm text-gray-500">Expected Output: {result.expectedOutput}</p>
                  <p className="text-sm text-gray-500">Actual Output: {result.actualOutput}</p>
                  <p className={`text-sm font-bold ${result.passed ? "text-green-600" : "text-red-600"}`}>
                    {result.passed ? "Passed" : "Failed"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CodeEditor;