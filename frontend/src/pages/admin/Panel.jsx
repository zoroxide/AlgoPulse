import UsersTable from '../../components/tables/UserTable';
import ModeratorsTable from '../../components/tables/ModeratorsTable';
import ProblemsTable from '../../components/tables/ProblemsTable';
import SheetsTable from '../../components/tables/SheetsTable';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import ContestTable from '../../components/tables/ContestTable';
import AdminSidebar from "../../components/admin-sidebar/Sidebar";
import AdminDashboard from './AdminDashboard';


// i know this is a lot of code but it is very important to understand the flow of the code
// i know this is also alot of shit, but the authContect not working here, please contibute if you now the solution
const getUserData = async () => {
    try {
      // Retrieve the token from local storage or another secure location
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log("admin panel error: no token found");
        throw new Error('No token found. Please log in.');
      }
  
      // Make the request to the get-user endpoint
      const response = await axiosInstance.get('/get-user', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      // Return the user data
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error; // Rethrow the error for the calling function to handle
    }
};



const Panel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndCheckUser = async () => {
      try {
        // Fetch user data
        const userData = await getUserData();

        // Log the user data
        console.log(`User data retrieved:`, userData);

        // Check if the user is an admin
        if (!userData.isAdmin) {
          console.log("User is not an admin. Redirecting...");
          navigate('/login', { replace: true }); // Redirect to login or home page
        } else {
          console.log("User is an admin. Access granted.");
        }
      } catch (error) {
        console.error("Failed to fetch user data or perform admin check:", error);
        // Optionally redirect to an error or login page
        navigate('/login', { replace: true });
      }
    };

    fetchAndCheckUser();
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersTable />;
      case "moderators":
        return <ModeratorsTable />;
      case "problems":
        return <ProblemsTable />;
      case "sheets":
        return <SheetsTable />;
      case "contest":
        return <ContestTable />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex">
      <AdminSidebar onSelectTab={setActiveTab} />
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default Panel;

