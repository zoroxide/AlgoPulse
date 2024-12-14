import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Alert } from 'flowbite-react';
import axiosInstance from '../../utils/axiosInstance';


const ProblemSet = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await axiosInstance.get('/problems');
                setProblems(response.data);
            } catch (error) {
                console.error('Error fetching problems:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    const difficultyBodyTemplate = (rowData) => {
        const difficultyColors = {
            Hard: 'text-red-600',
            Medium: 'text-yellow-500',
            Easy: 'text-green-600',
        };
        return (
            <span className={difficultyColors[rowData.difficulty] || 'text-gray-700'}>
                {rowData.difficulty}
            </span>
        );
    };

    const handleRowClick = (rowData) => {
        navigate(`/problem/${rowData._id}`);
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
        <h1 className="text-3xl font-semibold mb-6">Problem Set</h1>
            <div className="problems-table-container p-6">
            <DataTable
                value={problems}
                paginator
                rows={10}
                dataKey="_id"
                filters={filters}
                loading={loading}
                globalFilterFields={['name', 'difficulty']}
                header={header}
                emptyMessage="No problems found."
                onRowClick={(e) => handleRowClick(e.data)}
                className="p-datatable-custom"
            >
                <Column field="name" header="Problem" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                <Column
                    field="difficulty"
                    header="Difficulty"
                    body={difficultyBodyTemplate}
                    filter
                    filterPlaceholder="Search by difficulty"
                    style={{ minWidth: '12rem' }}
                />
            </DataTable>
        </div>
        </>
    );
};

export default ProblemSet;
