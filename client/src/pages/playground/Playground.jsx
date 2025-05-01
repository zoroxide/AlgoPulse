import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Button } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import templates from "../../templates.json";

const Playground = () => {
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [stdout, setStdout] = useState("");
  const [status, setStatus] = useState("");
  const [executionTime, setExecutionTime] = useState("N/A");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const languageMap = {
    cpp: "cpp",
    java: "java",
    py: "python",
    c: "c",
    go: "go",
    cs: "csharp",
    js: "javascript",
  };


  useEffect(() => {
      setCode(templates[language].template);
  }, [language]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(templates[lang]?.template || "");
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setStdout("");
    setStatus("");
    setExecutionTime("N/A");
    setIsError(false);

    try {
      const response = await axios.post(import.meta.env.VITE_CE_URL || "http://localhost:8080", {
        code,
        language,
        input: stdin || "",
      });

      if (response.data.error) {
        setStdout(response.data.error.trim());
        setStatus("Error");
        setIsError(true);
        toast.error("Error: Code execution failed.");
      } else {
        const output = response.data.output.trim();
        const time = response.data.timeStamp ? `${response.data.timeStamp} ms` : "N/A";
        setStdout(`${output}\n---------------\nTime: ${time}`);
        setStatus("Finished");
        setIsError(false);
        toast.success("Code executed successfully!");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      toast.error("Error executing code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCode = () => {
    const currentTime = new Date().toLocaleString();
    localStorage.setItem(currentTime, code);
    toast.success(`Your Code saved successfully at ${currentTime}!`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSaveCode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [code]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="flex items-center gap-4">
          <select
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-700 p-2 rounded text-white"
            value={language}
          >
            {Object.keys(languageMap).map((key) => (
              <option key={key} value={key}>
                {key.toUpperCase()}
              </option>
            ))}
          </select>
          <Button
            onClick={() => setTheme(theme === "vs-dark" ? "vs-light" : "vs-dark")}
            color="dark"
          >
            {theme === "vs-dark" ? "☀️" : "🌚"}
          </Button>
        </div>
        <Button onClick={handleRunCode} color="green" size="md" disabled={isLoading}>
          {isLoading ? "Running..." : "Run Code"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Code Editor */}
        <div className="flex-1">
          <MonacoEditor
            height="100%"
            language={languageMap[language]}
            theme={theme}
            value={code}
            onChange={(newValue) => setCode(newValue)}
          />
        </div>

        {/* Input and Output */}
        <div className="w-1/3 bg-gray-800 text-white flex flex-col gap-4 p-4">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Input (stdin):</label>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              rows="5"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
            />
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Output (stdout):</label>
              <span
                className={`text-sm font-bold ${
                  isError ? "text-red-500" : "text-green-500"
                }`}
              >
                {status}
              </span>
            </div>
            <textarea
              className={`w-full p-2 rounded ${
                isError ? "bg-red-700 text-white border-red-500" : "bg-gray-700 text-white border-gray-600"
              }`}
              rows="5"
              value={stdout}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;