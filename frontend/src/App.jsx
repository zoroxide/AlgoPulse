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
            <Route path="/" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/sheets/:sheetId" element={<SheetPage />} />
            <Route path="/contest/:contestId" element={<ContestPage />} />
            <Route path="/problems" element={<ProblemSet />} />
            <Route path="/sheets" element={<Sheets />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/admin" element={<Panel />} />
            <Route path="/admin/create-sheet" element={<AddSheet />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contest/:contestId/problem/:problemId" element={<ContestWorkspace />} />
            <Route path="/admin/create-problem" element={<AddProblem />} />
            <Route path="/admin/create-contest" element={<AddContest />} />
            <Route path="/problem/:problemId" element={<ProblemSetWorkspace />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;