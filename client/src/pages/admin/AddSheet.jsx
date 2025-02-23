import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Textarea, TextInput, Checkbox, Select } from 'flowbite-react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { classNames } from 'primereact/utils';

const AddSheet = () => {
    const [name, setName] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [content, setContent] = useState('');
    const [img, setImg] = useState('');
    const [problems, setProblems] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext); // Access AuthContext
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axiosInstance.get('/get-user');
                if (!data.isAdmin) {
                    toast.error('Access denied. Admins only.');
                    navigate('/login', { replace: true });
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                toast.error('Failed to authenticate. Please log in again.');
                navigate('/login', { replace: true });
            }
        };

        const fetchProblems = async () => {
            try {
                const { data } = await axiosInstance.get('/problems');
                setProblems(data);
            } catch (err) {
                console.error('Error fetching problems:', err);
                toast.error('Failed to fetch problems. Please try again.');
            }
        };

        fetchUserData();
        fetchProblems();
    }, [navigate]);

    const handleProblemChange = (e) => {
        const { value, checked } = e.target;
        setSelectedProblems((prev) =>
            checked ? [...prev, value] : prev.filter((id) => id !== value)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !difficulty || !content || !img) {
            setError('All fields are required.');
            toast.error('All fields are required.');
            return;
        }
        if (selectedProblems.length === 0) {
            setError('At least one problem must be selected.');
            toast.error('At least one problem must be selected.');
            return;
        }

        try {
            const { data: sheet } = await axiosInstance.post('/admin/sheet/create', {
                name,
                difficulty,
                content,
                img,
            });

            await axiosInstance.post('/admin/problem/link', {
                sheetId: sheet._id,
                problemIds: selectedProblems,
            });

            toast.success('Sheet created and problems linked successfully!');
            setName('');
            setDifficulty('');
            setContent('');
            setImg('');
            setSelectedProblems([]);
        } catch (error) {
            console.error('Error creating sheet or linking problems:', error);
            const errorMessage =
                error.response?.data?.message || 'Failed to create sheet or link problems.';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-2xl p-5">
                <ToastContainer />
                <h2 className="text-2xl font-semibold text-center mb-4">Add New Sheet</h2>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="mb-5">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <TextInput
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter sheet Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                        <Select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Select difficulty
                            </option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </Select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Image Link</label>
                        <TextInput
                            type="text"
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                            required
                            placeholder="Enter image URL"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <Textarea
                            value={content}
                            placeholder="Content..."
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-center">
                        <Button type="submit" gradientDuoTone="cyanToBlue">
                            Create Sheet
                        </Button>
                    </div>
                </form>
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
                                {problems.map((problem) => (
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
            </div>
        </div>
    );
};

export default AddSheet;
