import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileDropdown.css";

const ProfileDropdown = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear session
    localStorage.clear();

    // ✅ Redirect to login (remove history)
    navigate("/admin", { replace: true });
  };

  return (
    <div className="profile-dropdown">
      <img
        src="/yoga-02.jpg"
        alt="Profile"
        className="profile-thumb"
        data-bs-toggle="dropdown"
      />

      <ul className="dropdown-menu dropdown-menu-end">
        <li className="profile-header text-center">
          <img
            src="/yoga-02.jpg"
            className="profile-img"
            alt="Profile"
          />
          <h6 className="profile-name">Jane</h6>
          <p className="profile-email">jane@jane.com</p>
          <small className="profile-updated">
            Last updated 3 mins ago
          </small>
        </li>

        <li><a className="dropdown-item" href="#">Profile</a></li>
        {/* <li><a className="dropdown-item" href="#">Stats</a></li>
        <li><a className="dropdown-item" href="#">Messages</a></li>
        <li><a className="dropdown-item" href="#">Settings</a></li>
        <li><a className="dropdown-item" href="#">Help</a></li> */}

        {/* ✅ LOGOUT */}
        <li>
          <button
            className="dropdown-item"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
