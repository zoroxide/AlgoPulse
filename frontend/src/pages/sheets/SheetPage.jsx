import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Alert, Spinner } from 'flowbite-react';
import axiosInstance from '../../utils/axiosInstance';

const SheetPage = () => {
    const { sheetId } = useParams();
    const navigate = useNavigate();

    const [sheet, setSheet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSheet = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get(`sheets/${sheetId}`);
                setSheet(response.data);
            } catch (err) {
                setError('Failed to load the sheet. Please try again later.');
                console.error('Error fetching sheet:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (sheetId) {
            fetchSheet();
        }
    }, [sheetId]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Hard':
                return 'text-red-600';
            case 'Medium':
                return 'text-yellow-500';
            case 'Easy':
                return 'text-green-600';
            default:
                return 'text-gray-700';
        }
    };

    const handleProblemClick = (problemId) => {
        navigate(`/problem/${problemId}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="xl" color="blue" />
            </div>
        );
    }

    if (error) {
        return <Alert color="failure">{error}</Alert>;
    }

    if (!sheet) {
        return <Alert color="failure">Sheet not found.</Alert>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-4">{sheet.title}</h1>
            <p className="text-lg mb-6">{sheet.description}</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">Problems</h2>

            {/* Problems table */}
            <Table striped={true}>
                <Table.Head>
                    <Table.HeadCell className="text-black">Problem</Table.HeadCell>
                    <Table.HeadCell className="text-black">Difficulty</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                    {sheet.problems.map((problem) => (
                        <Table.Row key={problem._id} className="cursor-pointer">
                            <Table.Cell
                                className="text-blue-600 underline"
                                onClick={() => handleProblemClick(problem._id)}
                            >
                                {problem.name}
                            </Table.Cell>
                            <Table.Cell className={getDifficultyColor(problem.difficulty)}>
                                {problem.difficulty}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default SheetPage;
