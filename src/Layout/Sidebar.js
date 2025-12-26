import React, { useState, useEffect } from "react";
import {
  MdDashboard,
  MdKeyboardArrowDown,
  MdRadioButtonUnchecked,
  MdCategory,
} from "react-icons/md";

import {
  FaUser,
  FaFileAlt,
  FaHeartbeat,
  FaBell,
  FaBookOpen,
  FaPhone,
  FaFileContract,
  FaLock,
  FaImages,
  FaLanguage,
  FaExchangeAlt,
} from "react-icons/fa";

import { FaClipboardList } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ sidebarOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [openDropdown, setOpenDropdown] = useState(false);

  // Auto-open Users dropdown when inside client/trainer
  useEffect(() => {
    if (currentPath === "/client" || currentPath === "/trainer") {
      setOpenDropdown(true);
    }
  }, [currentPath]);

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="yoga-brand">
          <img
            src="/Yoga-icon-01.png"
            alt="Yoga Bharat"
            className="logo"
          />
        </div>
      </div>

      <ul className="sidebar-menu">

        {/* Dashboard */}
        <li className="menu-item">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            <MdDashboard className="menu-icon" />
            Dashboard
          </NavLink>
        </li>

        {/* Yogas */}
        <li className="menu-item">
          <NavLink to="/yoga" className={({ isActive }) => isActive ? "active" : ""}>
            <MdCategory className="menu-icon" />
            Yogas
          </NavLink>
        </li>

        {/* Users Dropdown */}
        <li className="menu-item dropdown">
          <div
            className="dropdown-toggle no-arrow"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <FaUser className="menu-icon user-icon" />
            Users
            <MdKeyboardArrowDown
              className={`arrow-icon ${openDropdown ? "rotate" : ""}`}
            />
          </div>
        </li>

        {openDropdown && (
          <>
            <li className="menu-item subitem">
              <NavLink to="/client" className={({ isActive }) => isActive ? "active" : ""}>
                <MdRadioButtonUnchecked className="menu-icon" />
                Client
              </NavLink>
            </li>

            <li className="menu-item subitem">
              <NavLink to="/trainer" className={({ isActive }) => isActive ? "active" : ""}>
                <MdRadioButtonUnchecked className="menu-icon" />
                Trainer
              </NavLink>
            </li>
          </>
        )}

        {/* Orders */}
        <li className="menu-item">
          <NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>
            <FaClipboardList className="menu-icon" />
            Orders
          </NavLink>
        </li>

        {/* Splash Screen */}
        <li className="menu-item">
          <NavLink to="/splash-screen" className={({ isActive }) => isActive ? "active" : ""}>
            <FaFileAlt className="menu-icon" />
            Splash Screen Text
          </NavLink>
        </li>

        {/* Health Preference */}
        <li className="menu-item">
          <NavLink to="/health-preference" className={({ isActive }) => isActive ? "active" : ""}>
            <FaHeartbeat className="menu-icon" />
            Health Preference
          </NavLink>
        </li>

        {/* Profession Details */}
        {/* <li className="menu-item">
          <NavLink to="/profession-details" className={({ isActive }) => isActive ? "active" : ""}>
            <FaBriefcase className="menu-icon" />
            Profession Details
          </NavLink>
        </li> */}

        {/* Notifications */}
        <li className="menu-item">
          <NavLink to="/notifications" className={({ isActive }) => isActive ? "active" : ""}>
            <FaBell className="menu-icon" />
            Notifications
          </NavLink>
        </li>

        {/* App Tutorial */}
        <li className="menu-item">
          <NavLink to="/app-tutorial" className={({ isActive }) => isActive ? "active" : ""}>
            <FaBookOpen className="menu-icon" />
            App Tutorial
          </NavLink>
        </li>

        {/* Callback Request */}
        <li className="menu-item">
          <NavLink to="/callback-request" className={({ isActive }) => isActive ? "active" : ""}>
            <FaPhone className="menu-icon" />
            Callback Request
          </NavLink>
        </li>

        {/* Terms & Conditions */}
        <li className="menu-item">
          <NavLink to="/terms-conditions" className={({ isActive }) => isActive ? "active" : ""}>
            <FaFileContract className="menu-icon" />
            Terms & Conditions
          </NavLink>
        </li>

        {/* Privacy Policy */}
        <li className="menu-item">
          <NavLink to="/privacy-policy" className={({ isActive }) => isActive ? "active" : ""}>
            <FaLock className="menu-icon" />
            Privacy Policy
          </NavLink>
        </li>

        {/* Feature Banners */}
        <li className="menu-item">
          <NavLink to="/feature-banners" className={({ isActive }) => isActive ? "active" : ""}>
            <FaImages className="menu-icon" />
            Feature Banners
          </NavLink>
        </li>

        {/* Languages */}
        <li className="menu-item">
          <NavLink to="/languages" className={({ isActive }) => isActive ? "active" : ""}>
            <FaLanguage className="menu-icon" />
            Languages
          </NavLink>
        </li>

        {/* Transactions */}
        <li className="menu-item">
          <NavLink to="/transactions" className={({ isActive }) => isActive ? "active" : ""}>
            <FaExchangeAlt className="menu-icon" />
            Transactions
          </NavLink>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
