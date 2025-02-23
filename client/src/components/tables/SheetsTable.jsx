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

const SheetsTable = () => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/sheets')
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          setSheets(data);
        } else {
          console.error('Expected an array but got:', data);
          setSheets([]);
        }
      })
      .catch(error => {
        console.error('Error fetching sheets:', error);
        setSheets([]);
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
    setSelectedSheet(rowData);
    setIsModalOpen(true);
  };

  const handleDelete = (rowData) => {
    axiosInstance.delete(`/admin/sheet/delete/${rowData._id}`)
      .then(response => {
        toast.success("Sheet deleted successfully!");
        console.log("Sheet deleted: ", response.data);
        setSheets(sheets.filter(sheet => sheet._id !== rowData._id));
      })
      .catch(error => {
        toast.error("Error deleting sheet!");
        console.error('Error deleting sheet:', error);
      });
  };

  const handleSave = (updatedSheet) => {
    axiosInstance.put(`/admin/sheet/edit/${updatedSheet._id}`, updatedSheet)
      .then(response => {
        toast.success("Sheet updated successfully!");
        setSheets(sheets.map(sheet => sheet._id === updatedSheet._id ? updatedSheet : sheet));
        setIsModalOpen(false);
      })
      .catch(error => {
        toast.error("Error updating sheet!");
        console.error('Error updating sheet:', error);
      });
  };

  const header = (
    <div className="table-header flex justify-between items-center">
      <span>List of Sheets</span>
      <Button onClick={() => navigate('/admin/create-sheet')} gradientDuoTone="cyanToBlue">
        Add Sheet
      </Button>
    </div>
  );

  return (
    <div className="users-table-container">
      <ToastContainer />
      <DataTable 
        value={sheets} 
        paginator 
        rows={10} 
        dataKey="id" 
        filters={filters}
        loading={loading}
        globalFilterFields={['name', 'imageLink', 'difficulty']} 
        header={header} 
        emptyMessage="No sheets found."
        className="p-datatable-custom"
      >
        <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
        <Column field="img" header="Image Link" filter filterPlaceholder="Search by image link" style={{ minWidth: '12rem' }} />
        <Column field="difficulty" header="Difficulty" filter filterPlaceholder="Search by difficulty" style={{ minWidth: '12rem' }} />
        <Column header="Options" body={optionsBodyTemplate} style={{ minWidth: '10rem' }} />
      </DataTable>
      {selectedSheet && (
        <EditModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedSheet}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default SheetsTable;
