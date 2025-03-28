import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, TextInput, Textarea } from 'flowbite-react';
import axiosInstance from '../../utils/axiosInstance';
import '../../components/tables/UserTable.css';

const EditSheet = () => {
  const { sheetId } = useParams();
  const navigate = useNavigate();
  const [sheetData, setSheetData] = useState({ name: '', content: '', problems: [] });
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  // Fetch sheet data and all problems
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sheetResponse = await axiosInstance.get(`/sheets/${sheetId}`);
        const problemsResponse = await axiosInstance.get('/problems');
        setSheetData(sheetResponse.data);
        setAllProblems(problemsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sheet or problems:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [sheetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSheetData({ ...sheetData, [name]: value });
  };

  const handleProblemToggle = (problemId) => {
    const updatedProblems = sheetData.problems.includes(problemId)
      ? sheetData.problems.filter((id) => id !== problemId)
      : [...sheetData.problems, problemId];
    setSheetData({ ...sheetData, problems: updatedProblems });
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put(`admin/sheet/edit/${sheetId}`, sheetData);
      navigate('/admin');
    } catch (error) {
      console.error('Error saving sheet:', error);
    }
  };

  const checkboxBodyTemplate = (rowData) => (
    <div className="flex justify-center">
      <input
        type="checkbox"
        checked={sheetData.problems.includes(rowData._id)}
        onChange={() => handleProblemToggle(rowData._id)}
        className="w-4 h-4"
      />
    </div>
  );

  const header = (
    <div className="table-header flex justify-between items-center">
      <span className="text-lg font-bold">Manage Problems</span>
      <TextInput
        type="text"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-1/3"
      />
    </div>
  );

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Sheet</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <TextInput
          type="text"
          name="name"
          value={sheetData.name}
          onChange={handleChange}
          placeholder="Enter sheet name"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <Textarea
          name="content"
          value={sheetData.content}
          onChange={handleChange}
          placeholder="Enter sheet description"
          rows={4}
        />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Problems</h2>
        <DataTable
          value={allProblems}
          paginator
          rows={10}
          dataKey="_id"
          loading={loading}
          globalFilter={globalFilter}
          globalFilterFields={['name', 'difficulty']}
          header={header}
          emptyMessage="No problems found."
          className="p-datatable-custom"
        >
          <Column
            header="Select"
            body={checkboxBodyTemplate}
            style={{ textAlign: 'center', width: '10%' }}
          />
          <Column field="name" header="Problem Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
          <Column field="difficulty" header="Difficulty" filter filterPlaceholder="Search by difficulty" style={{ minWidth: '10rem' }} />
        </DataTable>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <Button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Save
        </Button>
        <Button
          onClick={() => navigate('/admin')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditSheet;