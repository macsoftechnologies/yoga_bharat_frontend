import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../components/Table";

function ActiveClients() {
  const navigate = useNavigate();
  const location = useLocation();

  const { dashboardData, fromDate: initFrom, toDate: initTo } = location.state || {};

  const clients = dashboardData?.clients || [];

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(clients.length / pageSize);
  const paginatedData = clients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getImageUrl = (filename) =>
    filename ? `${process.env.REACT_APP_API_BASE_URL}/${filename}` : "";

  const columns = [
    { header: "S.No",        accessor: "srNo" },
    { header: "Profile",     accessor: "profile" },
    { header: "Name",        accessor: "name" },
    { header: "Email",       accessor: "email" },
    { header: "Mobile",      accessor: "mobileNumber" },
    { header: "role",        accessor: "role"},
    { header: "Gender",      accessor: "gender" },
    { header: "Age",         accessor: "age" },
    { header: "Health Pref", accessor: "health_preference" },
  ];

  const tableData = paginatedData.map((item, index) => ({
    srNo: (currentPage - 1) * pageSize + index + 1,
    profile: item.profile_pic ? (
      <img
        src={getImageUrl(item.profile_pic)}
        alt="Profile"
        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
      />
    ) : (
      <div
        style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: "#2dc9d8", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "16px",
        }}
      >
        {item.name?.[0]?.toUpperCase() || "?"}
      </div>
    ),
    name:              item.name || "-",
    email:             item.email || "-",
    mobileNumber:      item.mobileNumber || "-",
    role:              item.role || "-",
    gender:            item.gender || "-",
    age:               item.age || "-",
    health_preference: item.health_preference || "-",
  }));

  return (
    <div className="container mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 style={{ margin: 0 }}>ACTIVE CLIENTS</h2>
          {initFrom && initTo && (
            <small className="text-muted">
              Filter: {new Date(initFrom).toLocaleDateString("en-IN")} →{" "}
              {new Date(initTo).toLocaleDateString("en-IN")}
            </small>
          )}
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard", { state: { fromDate: initFrom, toDate: initTo } })}>
          ← Back
        </button>
      </div>

      {/* Summary */}
      <div className="card p-3 shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <div style={{ background: "linear-gradient(135deg, #2dc9d8, #1a8f9a)", borderRadius: "12px", padding: "20px 24px", color: "#fff" }}>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.85 }}>Active Clients</p>
              <h2 style={{ margin: "4px 0 0", fontWeight: 700 }}>{clients.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-3 shadow-sm mb-4">
        <h5 className="mb-3">Client Records</h5>
        <Table
          columns={columns}
          data={tableData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default ActiveClients;