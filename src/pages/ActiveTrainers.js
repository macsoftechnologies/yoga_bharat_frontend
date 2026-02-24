import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../components/Table";

function ActiveTrainers() {
  const navigate = useNavigate();
  const location = useLocation();

  const { dashboardData, fromDate: initFrom, toDate: initTo } = location.state || {};

  const trainers = dashboardData?.trainers || [];

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(trainers.length / pageSize);
  const paginatedData = trainers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getImageUrl = (filename) =>
    filename ? `${process.env.REACT_APP_API_BASE_URL}/${filename}` : "";

  const columns = [
    { header: "S.No",             accessor: "srNo" },
    { header: "Profile",          accessor: "profile" },
    { header: "Name",             accessor: "name" },
    { header: "Email",            accessor: "email" },
    { header: "Mobile",           accessor: "mobileNumber" },
    { header: "Gender",           accessor: "gender" },
    { header: "Age",              accessor: "age" },
    { header: "Role",             accessor: "role" },
    { header: "Account No",       accessor: "account_no" },
    { header: "Recipient Name",   accessor: "recipient_name" },
    { header: "eKYC",             accessor: "ekyc" },
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
          background: "#8b2291", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "16px",
        }}
      >
        {item.name?.[0]?.toUpperCase() || "?"}
      </div>
    ),
    name: (
      <span
        style={{ cursor: "pointer", color: "#6f42c1", fontWeight: 600 }}
        onClick={() => navigate(`/trainer/${item.userId}`)}
      >
        {item.name}
      </span>
    ),
    email:          item.email || "-",
    mobileNumber:   item.mobileNumber || "-",
    gender:         item.gender || "-",
    age:            item.age || "-",
    role:           item.role || "-",
    account_no:     item.account_no || "-",
    recipient_name: item.recipient_name || "-",
    ekyc: (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "6px",
          color: "#fff",
          fontSize: "12px",
          fontWeight: 600,
          background: item.ekyc_status === "approved" ? "#28a745" : "#dc3545",
        }}
      >
        {item.ekyc_status || "-"}
      </span>
    ),
  }));

  return (
    <div className="container mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 style={{ margin: 0 }}>ACTIVE TRAINERS</h2>
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
            <div style={{ background: "linear-gradient(135deg, #8b2291, #5a1260)", borderRadius: "12px", padding: "20px 24px", color: "#fff" }}>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.85 }}>Active Trainers</p>
              <h2 style={{ margin: "4px 0 0", fontWeight: 700 }}>{trainers.length}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{ background: "linear-gradient(135deg, #28a745, #1a7a30)", borderRadius: "12px", padding: "20px 24px", color: "#fff" }}>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.85 }}>Approved</p>
              <h2 style={{ margin: "4px 0 0", fontWeight: 700 }}>
                {trainers.filter((t) => t.ekyc_status === "approved").length}
              </h2>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{ background: "linear-gradient(135deg, #dc3545, #a01020)", borderRadius: "12px", padding: "20px 24px", color: "#fff" }}>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.85 }}>Pending eKYC</p>
              <h2 style={{ margin: "4px 0 0", fontWeight: 700 }}>
                {trainers.filter((t) => t.ekyc_status === "pending").length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-3 shadow-sm mb-4">
        <h5 className="mb-3">Trainer Records</h5>
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

export default ActiveTrainers;