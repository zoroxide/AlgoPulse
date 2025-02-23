import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "flowbite-react";
import { AuthContext } from '../../context/AuthContext';
import './UserTable.css';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance'; // Ensure axiosInstance is properly imported

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    axiosInstance.get('users')
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Expected an array but got:', data);
          setUsers([]);
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        toast.error("Failed to fetch users!");
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const optionsBodyTemplate = (rowData) => {
    return (
      <div className="flex space-x-2">
        <Button color="info" size="xs" onClick={() => handleEdit(rowData)}>
          Make Admin
        </Button>
        <Button color="failure" size="xs" onClick={() => handleDelete(rowData)}>
          Pan
        </Button>
      </div>
    );
  };

  const handleEdit = (rowData) => {
    axiosInstance.put(`admin/user/make-admin/${rowData._id}`)
      .then(response => {
        toast.success("User promoted to admin successfully!");
        console.log("User promoted to admin: ", response.data);
      })
      .catch(error => {
        toast.error("Error promoting user to admin!");
        console.error('Error promoting user to admin:', error);
      });
  };

  const handleDelete = (rowData) => {
    axiosInstance.delete(`admin/user/delete/${rowData._id}`)
      .then(response => {
        toast.success("User panned successfully!");
        console.log("User panned: ", response.data);
      })
      .catch(error => {
        toast.error("Error panning user!");
        console.error('Error panning user:', error);
      });
  };

  const header = (
    <div className="table-header">
      List of Users
    </div>
  );

  return (
    <div className="users-table-container">
      <ToastContainer />
      <DataTable
        value={users}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        loading={loading}
        globalFilterFields={['name', 'phone', 'email', 'username', 'codeforcesHandle']}
        header={header}
        emptyMessage="No users found."
        className="p-datatable-custom"
      >
        <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
        <Column field="phone" header="Phone" filter filterPlaceholder="Search by phone" style={{ minWidth: '12rem' }} />
        <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
        <Column field="username" header="Username" filter filterPlaceholder="Search by username" style={{ minWidth: '12rem' }} />
        <Column field="cf_handle" header="Codeforces Handle" filter filterPlaceholder="Search by handle" style={{ minWidth: '12rem' }} />
        <Column header="Options" body={optionsBodyTemplate} style={{ minWidth: '10rem' }} />
      </DataTable>
    </div>
  );
};

export default UserTable;