import React, { useState, useEffect } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import './UserTable.css';
import SheetModals from '../modals/SheetModals';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../utils/axiosInstance';

const SheetsTable = () => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleEdit = (rowData) => {
    navigate(`/admin/edit-sheet/${rowData._id}`); // Navigate to the EditSheet page
  };

  const handleDelete = (rowData) => {
    axiosInstance.delete(`/admin/sheet/delete/${rowData._id}`)
      .then(response => {
        toast.success("Sheet deleted successfully!");
        setSheets(sheets.filter(sheet => sheet._id !== rowData._id));
      })
      .catch(error => {
        toast.error("Error deleting sheet!");
        console.error('Error deleting sheet:', error);
      });
  };

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
    </div>
  );
};

export default SheetsTable;
