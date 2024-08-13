import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
// admin
import CreateUsers from "./pages/admin-pages/Users";
import Dashboard from "./pages/admin-pages/Dashboard"

// user 
import UserDashboard from './pages/user-pages/UserDashboard';
import Aboutus from './pages/user-pages/Aboutus'
function App() {

  return (
    <div className="App">
      <div className="conatiner-fluid">
        <div className="wrapper">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/admin-dashboard" element={<Dashboard />} />
            {/*  <Route exact path="/create-student" element={<CreateStudent />} />
            <Route exact path="/create-school" element={<CreateSchool />} />

            <Route exact path="/create-parent" element={<CreateParent />} />
            <Route exact path="/create-role" element={<CreateRole />} />
            <Route exact path="/create-section" element={<CreateSection />} />
            <Route exact path="/teacher" element={<Teacher />} /> */}

            <Route exact path="/create-user" element={<CreateUsers />} />
            <Route exact path="/user-dashboard" element={<UserDashboard />} />
            <Route exact path="/aboutus" element={<Aboutus />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
export default App;