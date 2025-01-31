import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Spinner, Alert } from 'flowbite-react';
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

            <div className="problems-table-container p-6">
                <DataTable
                    value={sheet.problems}
                    paginator
                    rows={10}
                    dataKey="_id"
                    loading={isLoading}
                    globalFilterFields={['name', 'difficulty']}
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
        </div>
    );
};

export default SheetPage;