import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Label, Modal, Select, TextInput, Textarea } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HR } from "flowbite-react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from '../../context/AuthContext';

Quill.register("modules/imageResize", ImageResize);

const AddProblem = () => {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
  const [testcases, setTestCases] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [currentOutput, setCurrentOutput] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndCheckUser = async () => {
      try {
        // Check if the user is an admin
        if (!user || !user.isAdmin) {
          console.log("User is not an admin. Redirecting...");
          navigate('/login', { replace: true }); // Redirect to login or home page
        } else {
          console.log("User is an admin. Access granted.");
        }
      } catch (error) {
        console.error("Failed to perform admin check:", error);
        // Optionally redirect to an error or login page
        navigate('/login', { replace: true });
      }
    };

    fetchAndCheckUser();
  }, [user, navigate]);

  const handleValidation = () => {
    if (!name) {
      toast.error("Problem name is required!");
      return false;
    }
    if (!difficulty) {
      toast.error("Problem difficulty is required!");
      return false;
    }
    if (!description || description.trim() === "<p><br></p>") {
      toast.error("Problem description is required!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      const response = await axiosInstance.post("admin/problem/create", {
        name,
        difficulty,
        description,
        testcases
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });
      if (response.status === 201) {
        toast.success("Problem created successfully!");
        setName("");
        setDifficulty("");
        setDescription("");
        setTestCases([]);
      } else {
        toast.error(response.data.message || "Failed to create problem. Please try again.");
      }
    } catch (error) {
      console.error("Error creating problem", error);
      toast.error("Failed to create problem. Please try again.");
    }
  };

  const addTestCase = () => {
    if (!currentInput || !currentOutput) {
      toast.error("Both input and output are required!");
      return;
    }
    setTestCases([...testcases, { inputs: [currentInput], outputs: [currentOutput] }]);
    setCurrentInput("");
    setCurrentOutput("");
    setModalOpen(false);
  };

  const toolbarOptions = [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
    imageResize: {
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  };

  return (
    <div className="flex justify-center items-start mt-10 px-5">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-center mb-5">Add New Problem</h1>
        <div>
          <Label htmlFor="problem-name" value="Problem Name" />
          <TextInput
            id="problem-name"
            type="text"
            placeholder="Enter problem name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="difficulty" value="Problem Difficulty" />
          <Select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
            className="mt-2"
          >
            <option value="">Select difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="description" value="Problem Description" />
          <ReactQuill
            id="description"
            value={description}
            onChange={setDescription}
            placeholder="Enter a detailed description..."
            theme="snow"
            modules={modules}
            className="mt-2"
            style={{ height: "500px" }}
          />
        </div>
        <br></br>
        <HR></HR>
        <div>
          <Button gradientDuoTone="cyanToBlue" onClick={() => setModalOpen(true)}>
            Add Test Case
          </Button>
          {testcases.map((testCase, index) => (
            <div key={index} className="mt-3">
              <h5 className="font-semibold">Test Case {index + 1}</h5>
              <div className="flex items-center gap-2">
                <pre>
                  <code>
                    <span className="font-medium">Inputs:</span>
                    {testCase.inputs.join(", ")}
                  </code>
                </pre>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <pre>
                  <code>
                    <span className="font-medium">Outputs:</span> {testCase.outputs.join(", ")}
                  </code>
                </pre>
              </div>
            </div>
          ))}
        </div>
        <br></br>

        <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
          <Modal.Header>Add Test Case</Modal.Header>
          <Modal.Body>
            <div>
              <Label htmlFor="test-input" value="Input" />
              <Textarea
                id="test-input"
                placeholder="Enter input"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="mt-2"
                rows={4} // Adjust rows as per your UI preference
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="test-output" value="Output" />
              <Textarea
                id="test-output"
                placeholder="Enter output"
                value={currentOutput}
                onChange={(e) => setCurrentOutput(e.target.value)}
                className="mt-2"
                rows={4} // Adjust rows as per your UI preference
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={addTestCase}>Add</Button>
            <Button color="gray" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="flex justify-center">
          <Button type="submit" gradientDuoTone="cyanToBlue" className="px-10">
            Submit
          </Button>
        </div>
        <br></br>
        <br></br>
      </form>
    </div>
  );
};

export default AddProblem;