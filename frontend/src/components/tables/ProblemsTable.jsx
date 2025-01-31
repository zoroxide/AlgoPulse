import React, { useState, useEffect } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import './UserTable.css';
import EditModal from './EditModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../utils/axiosInstance';

const ProblemsTable = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/problems')
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          setProblems(data);
        } else {
          console.error('Expected an array but got:', data);
          setProblems([]);
        }
      })
      .catch(error => {
        console.error('Error fetching problems:', error);
        setProblems([]);
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
    setSelectedProblem(rowData);
    setIsModalOpen(true);
  };

  const handleDelete = (rowData) => {
    axiosInstance.delete(`admin/problem/delete/${rowData._id}`)
      .then(response => {
        toast.success("Problem deleted successfully!");
        setProblems(problems.filter(problem => problem._id !== rowData._id));
      })
      .catch(error => {
        toast.error("Error deleting problem!");
        console.error('Error deleting problem:', error);
      });
  };

  const handleSave = (updatedProblem) => {
    axiosInstance.put(`/admin/problem/edit/${updatedProblem._id}`, updatedProblem)
      .then(response => {
        toast.success("Problem updated successfully!");
        setProblems(problems.map(problem => problem.id === updatedProblem.id ? updatedProblem : problem));
        setIsModalOpen(false);
      })
      .catch(error => {
        toast.error("Error updating problem!");
        console.error('Error updating problem:', error);
      });
  };

  const header = (
    <div className="table-header flex justify-between items-center">
      <span>List of Problems</span>
      <Button onClick={() => navigate('/admin/create-problem')} gradientDuoTone="cyanToBlue">
        Add Problem
      </Button>
    </div>
  );

  return (
    <div className="users-table-container">
      <ToastContainer />
      <DataTable 
        value={problems} 
        paginator 
        rows={10} 
        dataKey="id" 
        filters={filters} 
        loading={loading}
        globalFilterFields={['name', 'difficulty', 'genre']} 
        header={header} 
        emptyMessage="No problems found."
        className="p-datatable-custom"
      >
        <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
        <Column field="difficulty" header="Difficulty" filter filterPlaceholder="Search by difficulty" style={{ minWidth: '12rem' }} />
        <Column header="Options" body={optionsBodyTemplate} style={{ minWidth: '10rem' }} />
      </DataTable>
      {selectedProblem && (
        <EditModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedProblem}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProblemsTable;