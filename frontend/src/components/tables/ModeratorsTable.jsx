import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "flowbite-react";
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserTable.css';

const ModeratorsTable = () => {
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const { currentUser } = useContext(AuthContext); 

  useEffect(() => {
    fetch('/api/users', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const admins = data.filter(user => user.isAdmin);
          setModerators(admins);
        } else {
          console.error('Expected an array but got:', data);
          setModerators([]);
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setModerators([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const optionsBodyTemplate = (rowData) => {
    return (
      <div className="flex space-x-2">
        <Button color="info" size="xs" onClick={() => handleEdit(rowData)}>
          Make Normal User
        </Button>
        <Button color="failure" size="xs" onClick={() => handleDelete(rowData)}>
          Pan
        </Button>
      </div>
    );
  };

  const handleEdit = (rowData) => {
    fetch(`/api/user/make-admin/${rowData.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          toast.error("Error demoting user to normal user.");
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        toast.success("User demoted to normal user!");
        console.log("User demoted to normal user: ", data);
        // Update the moderators state if necessary
      })
      .catch(error => {
        toast.error("Error demoting user to normal user!");
        console.error('Error demoting user to normal user:', error);
      });
  };

  const handleDelete = (rowData) => {
    fetch(`/api/user/pan/${rowData.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          toast.error("Error panning user.");
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        toast.success("User panned successfully!");
        console.log("User panned: ", data);
        // Update the moderators state if necessary
      })
      .catch(error => {
        toast.error("Error panning user!");
        console.error('Error panning user:', error);
      });
  };

  const header = (
    <div className="table-header">
      List of Moderators
    </div>
  );

  return (
    <div className="users-table-container">
      <ToastContainer />
      <DataTable 
        value={moderators} 
        paginator 
        rows={10} 
        dataKey="id" 
        filters={filters} 
        loading={loading}
        globalFilterFields={['name', 'phone', 'email', 'username', 'codeforcesHandle']} 
        header={header} 
        emptyMessage="No moderators found."
        className="p-datatable-custom"
      >
        <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
        <Column field="phone" header="Phone" filter filterPlaceholder="Search by phone" style={{ minWidth: '12rem' }} />
        <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
        <Column field="username" header="Username" filter filterPlaceholder="Search by username" style={{ minWidth: '12rem' }} />
        <Column field="codeforcesHandle" header="Codeforces Handle" filter filterPlaceholder="Search by handle" style={{ minWidth: '12rem' }} />
        <Column header="Options" body={optionsBodyTemplate} style={{ minWidth: '10rem' }} />
      </DataTable>
    </div>
  );
};

export default ModeratorsTable;