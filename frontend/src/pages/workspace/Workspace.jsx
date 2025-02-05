import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProblemDescription from "../../components/workspace/problem-dis/ProblemDescription";
import CodeEditor from "../../components/workspace/code-editor/CodeEditor";

const Workspace = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [leftWidth, setLeftWidth] = useState(50);

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth >= 10 && newLeftWidth <= 90) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosInstance.get(`/problems/${problemId}`);
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching problem data:", error);
      }
    };

    fetchProblem();
  }, [problemId]);

  return (
    <div className="flex h-screen">
      {/* Problem Description Section */}
      <div
        className="p-4 bg-gray-900 text-white"
        style={{ width: `${leftWidth}%` }}
      >
        {problem ? (
          <div
            dangerouslySetInnerHTML={{ __html: problem.description }}
          ></div>
        ) : (
          <p>Loading problem...</p>
        )}
      </div>

      {/* Divider for resizing */}
      <div
        onMouseDown={handleMouseDown}
        className="bg-gray-600 hover:bg-gray-500 cursor-col-resize"
        style={{ width: "5px" }}
      ></div>

      {/* Code Editor Section */}
      <div className="flex flex-col" style={{ width: `${100 - leftWidth}%` }}>
        <CodeEditor problem={problem} />
      </div>
    </div>
  );
};

export default Workspace;
