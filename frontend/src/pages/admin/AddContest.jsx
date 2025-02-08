import React, { useState, useEffect, useContext } from 'react';
import { Button, Label, TextInput, Textarea, Select, Checkbox, HR } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../utils/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddContest = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [startTime, setStartTime] = useState("");
    const [contest, setContest] = useState("");
    const [endTime, setEndTime] = useState("");
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState('');
    const [selectedProblems, setSelectedProblems] = useState([]);

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

        const fetchProblems = async () => {
            try {
                const response = await axiosInstance.get('/problems');
                setProblems(response.data);
            } catch (err) {
                console.error('Error fetching problems:', err);
            }
        };

        fetchAndCheckUser();
        fetchProblems();
    }, [user, navigate]);

    const handleProblemChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedProblems([...selectedProblems, value]);
        } else {
            setSelectedProblems(selectedProblems.filter(id => id !== value));
        }
    };
    
    console.log("Selected problems array:", selectedProblems);
    

    const handleValidation = () => {
        if (!name) {
            toast.error("Contest name is required!");
            return false;
        }
        if (!description) {
            toast.error("Contest description is required!");
            return false;
        }
        if (!difficulty) {
            toast.error("Contest difficulty is required!");
            return false;
        }
        if (!startTime) {
            toast.error("Start time is required!");
            return false;
        }
        if (!endTime) {
            toast.error("End time is required!");
            return false;
        }
        if (new Date(startTime) >= new Date(endTime)) {
            toast.error("End time must be after the start time!");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!handleValidation()) return;
    
        if (selectedProblems.length === 0) {
            setError('At least one problem must be selected.');
            toast.error('At least one problem must be selected.');
            return;
        }
    
        try {
            // Step 1: Create the contest
            const createdContest = await axiosInstance.post('admin/contest/create', {
                name,
                description,
                difficulty,
                startTime,
                endTime,
            });
    
            console.log("Created contest data:", createdContest);
    
            // Step 2: Link problems to the contest
            const linkResponse = await axiosInstance.post('admin/contest/link', {
                contestId: createdContest.data._id, // Use the correct contest ID from the response
                problemIds: selectedProblems,
            });
    
            console.log("Linked problems response:", linkResponse);
    
            toast.success('Contest created and problems linked successfully!');
            setName('');
            setDescription('');
            setDifficulty('');
            setStartTime('');
            setEndTime('');
            setSelectedProblems([]);
        } catch (error) {
            console.error('Error creating contest or linking problems:', error);
            const errorMessage =
                error.response?.data?.message || 'Failed to create contest or link problems.';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };
    



    const header = (
        <div className="table-header flex justify-between items-center">
            <span>List of Sheets</span>
            <Button onClick={() => navigate('/admin/create-contest')} gradientDuoTone="cyanToBlue">
                Add Contest
            </Button>
        </div>
    );

    return (
        <div className="flex justify-center items-start mt-10 px-5">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-6">
                <h1 className="text-3xl font-bold text-center mb-5">Add New Contest</h1>
                <div>
                    <Label htmlFor="contest-name" value="Contest Name" />
                    <TextInput
                        id="contest-name"
                        type="text"
                        placeholder="Enter contest name"
                        value={name}
                        header={header}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="contest-description" value="Contest Description" />
                    <Textarea
                        id="contest-description"
                        placeholder="Enter contest description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="contest-difficulty" value="Contest Difficulty" />
                    <Select
                        id="contest-difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        required
                        className="mt-2"
                    >
                        <option value="">Select difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="start-time" value="Start Time" />
                    <TextInput
                        id="start-time"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="end-time" value="End Time" />
                    <TextInput
                        id="end-time"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                        className="mt-2"
                    />
                </div>
                <HR />
                <div>
                    <h3 className="text-xl font-semibold text-center mb-2">Select Problems</h3>
                    {problems.length > 0 ? (
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 py-2 px-4 text-center">Select</th>
                                    <th className="border border-gray-300 py-2 px-4 text-center">Problem Name</th>
                                    <th className="border border-gray-300 py-2 px-4 text-center">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {problems.map(problem => (
                                    <tr key={problem._id}>
                                        <td className="border border-gray-300 py-2 px-4 text-center">
                                            <Checkbox
                                                id={problem._id}
                                                value={problem._id}
                                                checked={selectedProblems.includes(problem._id)}
                                                onChange={handleProblemChange}
                                            />
                                        </td>
                                        <td className="border border-gray-300 py-2 px-4 text-center">{problem.name}</td>
                                        <td className="border border-gray-300 py-2 px-4 text-center">{problem.difficulty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-gray-500 text-center">No problems available.</div>
                    )}
                </div>
                <br></br>
                <HR />
                <div className="flex justify-center">
                    <Button type="submit" gradientDuoTone="cyanToBlue" className="px-10">
                        Submit
                    </Button>
                    <br></br>
                </div>
                <br></br>
            </form>
            <br></br>
        </div>
    );
};

export default AddContest;