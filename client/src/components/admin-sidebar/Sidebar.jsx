import { Sidebar } from "flowbite-react";
import { HiArchive, HiChartPie, HiFlag, HiInbox, HiOutlineHand, HiShoppingBag, HiUser, HiViewBoards } from "react-icons/hi";

const AdminSidebar = ({ onSelectTab }) => {
  return (
    <Sidebar aria-label="Sidebar with logo branding example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="#"
            icon={HiChartPie}
            onClick={() => onSelectTab("dashboard")}
          >
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiViewBoards}
            onClick={() => onSelectTab("problems")}
          >
            Problems
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiInbox}
            onClick={() => onSelectTab("sheets")}
          >
            Sheets
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiArchive}
            onClick={() => onSelectTab("contest")}
          >
            Contests
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiUser}
            onClick={() => onSelectTab("users")}
          >
            Users
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiShoppingBag}
            onClick={() => onSelectTab("moderators")}
          >
            Moderators
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiFlag}
            onClick={() => onSelectTab("blogs")}
          >
            Blogs
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default AdminSidebar;