import UsersTable from '../../components/tables/UserTable';
import ModeratorsTable from '../../components/tables/ModeratorsTable';
import ProblemsTable from '../../components/tables/ProblemsTable';
import SheetsTable from '../../components/tables/SheetsTable';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import ContestTable from '../../components/tables/ContestTable';
import AdminSidebar from "../../components/admin-sidebar/Sidebar";
import AdminDashboard from './AdminDashboard';
import { AuthContext } from '../../context/AuthContext';

const Panel = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = () => {
      if (user) {
        if (!user.isAdmin) {
          console.log("User is not an admin. Redirecting...");
          navigate('/login', { replace: true }); // Redirect to login or home page
        } else {
          console.log("User is an admin. Access granted.");
        }
      } else {
        console.log("User data not available. Redirecting...");
        navigate('/login', { replace: true }); // Redirect to login or home page
      }
    };

    checkAdmin();
  }, [user, navigate]);

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