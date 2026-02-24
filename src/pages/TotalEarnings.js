import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../components/Table";

function TotalEarnings() {
  const navigate = useNavigate();
  const location = useLocation();

  const { dashboardData, fromDate: initFrom, toDate: initTo } = location.state || {};

  const earnings = dashboardData?.earnings || [];
  const totalAmount = dashboardData?.totalEarningsAmount || 0;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(earnings.length / pageSize);
  const paginatedData = earnings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    { header: "S.No",          accessor: "srNo" },
    { header: "Earned Amount", accessor: "earned_amount" },
    { header: "Date",          accessor: "date" },
  ];

  const tableData = paginatedData.map((item, index) => ({
    srNo:          (currentPage - 1) * pageSize + index + 1,
    earned_amount: item.earned_amount ? `₹${item.earned_amount}` : "₹0",
    date:          item.date ? new Date(item.date).toLocaleDateString("en-IN") : "-",
  }));

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 style={{ margin: 0 }}>TOTAL EARNINGS</h2>
          {initFrom && initTo && (
            <small className="text-muted">
              Filter: {new Date(initFrom).toLocaleDateString("en-IN")} →{" "}
              {new Date(initTo).toLocaleDateString("en-IN")}
            </small>
          )}
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard", { state: { fromDate: initFrom, toDate: initTo } })}
        >
          ← Back
        </button>
      </div>

      <div className="card p-3 shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <div style={{ background: "linear-gradient(135deg, #17a951, #0d7a3b)", borderRadius: "12px", padding: "20px 24px", color: "#fff" }}>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.85 }}>Total Earnings</p>
              <h2 style={{ margin: "4px 0 0", fontWeight: 700 }}>₹{totalAmount}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{ background: "linear-gradient(135deg, #2dc9d8, #1a8f9a)", borderRadius: "12px", padding: "20px 24px", color: "#fff" }}>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.85 }}>Total Records</p>
              <h2 style={{ margin: "4px 0 0", fontWeight: 700 }}>{earnings.length}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-3 shadow-sm mb-4">
        <h5 className="mb-3">Earnings Records</h5>
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

export default TotalEarnings;