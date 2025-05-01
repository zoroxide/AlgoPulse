import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/navbar/NavBar";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import AddProblem from "./pages/admin/AddProblem";
import AddSheet from "./pages/admin/AddSheet";
import Explore from "./pages/explore/Explore";
import SheetPage from "./pages/sheets/SheetPage";
import Panel from "./pages/admin/Panel";
import Dashboard from "./pages/dashboard/Dashboard";
import AddContest from "./pages/admin/AddContest";
import ProblemSet from "./pages/problemset/ProblemSet";
import Sheets from "./pages/sheets/Sheets";
import Contests from "./pages/contests/Contests";
import ContestPage from "./pages/contests/ContestPage";
import ContestWorkspace from "./pages/workspace/ContestWorkspace";
import ProblemSetWorkspace from "./pages/workspace/ProblemSetWorkspace";
import ProtectedRoute from "./utils/ProtectedRoute";
import Blogs from "./pages/blogs/Blogs";
import AddBlog from "./pages/admin/AddBlog";
import EditSheet from "./pages/admin/EditSheet";
import EditContest from "./pages/admin/EditContest";
import Playground from "./pages/playground/Playground";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "react-quill/dist/quill.snow.css";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Nav />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/blogs" element={<ProtectedRoute><Blogs /></ProtectedRoute>} />
            <Route path="/sheets" element={<ProtectedRoute><Sheets /></ProtectedRoute>} />
            <Route path="/sheets/:sheetId" element={<ProtectedRoute><SheetPage /></ProtectedRoute>} />
            <Route path="/contests" element={<ProtectedRoute><Contests /></ProtectedRoute>} />
            <Route path="/contest/:contestId" element={<ProtectedRoute><ContestPage /></ProtectedRoute>} />
            <Route path="/contest/:contestId/problem/:problemId" element={<ProtectedRoute><ContestWorkspace /></ProtectedRoute>} />
            <Route path="/problems" element={<ProtectedRoute><ProblemSet /></ProtectedRoute>} />
            <Route path="/problem/:problemId" element={<ProtectedRoute><ProblemSetWorkspace /></ProtectedRoute>} />
            <Route path="/playground" element={<ProtectedRoute><Playground /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Panel /></ProtectedRoute>} />
            <Route path="/admin/create-sheet" element={<ProtectedRoute adminOnly={true}><AddSheet /></ProtectedRoute>} />
            <Route path="/admin/create-problem" element={<ProtectedRoute adminOnly={true}><AddProblem /></ProtectedRoute>} />
            <Route path="/admin/create-contest" element={<ProtectedRoute adminOnly={true}><AddContest /></ProtectedRoute>} />
            <Route path="/admin/create-blog" element={<ProtectedRoute adminOnly={true}><AddBlog /></ProtectedRoute>} />
            <Route path="/admin/edit-sheet/:sheetId" element={<ProtectedRoute adminOnly={true}><EditSheet /></ProtectedRoute>} />
            <Route path="/admin/edit-contest/:contestId" element={<ProtectedRoute adminOnly={true}><EditContest /></ProtectedRoute>} />
            
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;