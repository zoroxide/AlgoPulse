import React, { useState, useEffect } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserTable.css';
import EditModal from './EditModal';
import axiosInstance from '../../utils/axiosInstance'; 

const ContestTable = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [selectedContest, setSelectedContest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get('contests')
            .then(response => {
                const data = response.data;
                if (Array.isArray(data)) {
                    setContests(data);
                } else {
                    console.error('Expected an array but got:', data);
                    setContests([]);
                }
            })
            .catch(error => {
                console.error('Error fetching contests:', error);
                setContests([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const optionsBodyTemplate = (rowData) => {
        return (
            <div className="flex space-x-2">
                <Button color="info" size="xs" onClick={() => handleEdit(rowData)}>
                    Edit
                </Button>
                <Button color="failure" size="xs" onClick={() => handleDelete(rowData)}>
                    Delete
                </Button>
            </div>
        );
    };

    const handleEdit = (rowData) => {
        setSelectedContest(rowData);
        setIsModalOpen(true);
    };

    const handleDelete = (rowData) => {
        axiosInstance.delete(`admin/contest/delete/${rowData._id}`)
            .then(response => {
                toast.success("Contest deleted successfully!");
                setContests(contests.filter(contest => contest._id !== rowData._id));
            })
            .catch(error => {
                toast.error("Error deleting contest!");
                console.error('Error deleting contest:', error);
            });
    };

    const handleSave = (updatedContest) => {
        axiosInstance.put(`admin/contest/edit/${updatedContest._id}`, updatedContest)
            .then(response => {
                toast.success("Contest updated successfully!");
                setContests(contests.map(contest => contest._id === updatedContest._id ? updatedContest : contest));
                setIsModalOpen(false);
            })
            .catch(error => {
                toast.error("Error updating contest!");
                console.error('Error updating contest:', error);
            });
    };

    const header = (
        <div className="table-header flex justify-between items-center">
          <span>List of Contests</span>
          <Button onClick={() => navigate('/admin/create-contest')} gradientDuoTone="cyanToBlue">
            Add Contests
          </Button>
        </div>
      );

    return (
        <div className="contests-table-container">
            <ToastContainer />
            <DataTable
                value={contests}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                loading={loading}
                globalFilterFields={['name', 'difficulty', 'description']}
                header={header}
                emptyMessage="No contests found."
                className="p-datatable-custom"
            >
                <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                <Column field="difficulty" header="Difficulty" filter filterPlaceholder="Search by difficulty" style={{ minWidth: '12rem' }} />
                <Column field="description" header="Description" filter filterPlaceholder="Search by description" style={{ minWidth: '12rem' }} />
                <Column field="startTime" header="Start Time" filter filterPlaceholder="Search by start time" style={{ minWidth: '12rem' }} />
                <Column field="endTime" header="End Time" filter filterPlaceholder="Search by end time" style={{ minWidth: '12rem' }} />
                <Column header="Options" body={optionsBodyTemplate} style={{ minWidth: '10rem' }} />
            </DataTable>
            {selectedContest && (
                <EditModal
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={selectedContest}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default ContestTable;