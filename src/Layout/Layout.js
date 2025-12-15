import React, { useState } from "react";
import Sidebar from "../Layout/Sidebar";
import Navbar from "../Layout/Navbar";
import { Outlet } from "react-router-dom";
import './Layout.css'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout-container">
      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
