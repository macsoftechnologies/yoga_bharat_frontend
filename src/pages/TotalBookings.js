import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../components/Table";

function TotalBookings() {
  const navigate = useNavigate();
  const location = useLocation();

  const { dashboardData, fromDate: initFrom, toDate: initTo } = location.state || {};

  const bookings = dashboardData?.bookings || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const pageSize = 10;

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "#28a745";
      case "cancelled": return "#dc3545";
      case "accepted":  return "#17a2b8";
      case "opened":    return "#ffc107";
      default:          return "#6c757d";
    }
  };

  const statusCards = [
    { key: "all",       label: "Total Bookings", color: "linear-gradient(135deg, #feb131, #e08800)" },
    { key: "opened",    label: "Opened",         color: "linear-gradient(135deg, #ffc107, #b38600)" },
    { key: "accepted",  label: "Accepted",       color: "linear-gradient(135deg, #17a2b8, #0f6675)" },
    { key: "completed", label: "Completed",      color: "linear-gradient(135deg, #28a745, #1a7a30)" },
    { key: "cancelled", label: "Cancelled",      color: "linear-gradient(135deg, #dc3545, #a01020)" },
  ];

  const filteredBookings =
    activeFilter === "all" ? bookings : bookings.filter((b) => b.status === activeFilter);

  const totalPages    = Math.ceil(filteredBookings.length / pageSize);
  const paginatedData = filteredBookings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    { header: "S.No",            accessor: "srNo" },
    { header: "Booking Type",    accessor: "bookingType" },
    { header: "Time",            accessor: "time" },
    { header: "Package Details", accessor: "package_details" },
    { header: "Status",          accessor: "status" },
  ];

  const tableData = paginatedData.map((item, index) => ({
    srNo:            (currentPage - 1) * pageSize + index + 1,
    bookingType:     item.bookingType || "-",
    time:            item.time || "-",
    package_details: item.package_details || "-",
    status: (
      <span
        style={{
          padding: "3px 10px",
          borderRadius: "6px",
          color: item.status === "opened" ? "#000" : "#fff",
          fontSize: "12px",
          fontWeight: 600,
          background: getStatusColor(item.status),
        }}
      >
        {item.status || "-"}
      </span>
    ),
  }));

  return (
    <div className="container mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 style={{ margin: 0 }}>TOTAL BOOKINGS</h2>
          {initFrom && initTo && (
            <small className="text-muted">
              Filter: {new Date(initFrom).toLocaleDateString("en-IN")} to{" "}
              {new Date(initTo).toLocaleDateString("en-IN")}
            </small>
          )}
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard", { state: { fromDate: initFrom, toDate: initTo } })}
        >
          Back
        </button>
      </div>

      {/* Clickable Status Filter Cards */}
      <div className="row g-3 mb-4">
        {statusCards.map((card) => {
          const count =
            card.key === "all"
              ? bookings.length
              : bookings.filter((b) => b.status === card.key).length;
          const isActive = activeFilter === card.key;

          return (
            <div className="col-md-2" key={card.key}>
              <div
                onClick={() => { setActiveFilter(card.key); setCurrentPage(1); }}
                style={{
                  background:    card.color,
                  borderRadius:  "12px",
                  padding:       "16px 20px",
                  color:         "#fff",
                  cursor:        "pointer",
                  outline:       isActive ? "3px solid #333" : "3px solid transparent",
                  outlineOffset: "2px",
                  transition:    "transform 0.15s, box-shadow 0.15s",
                  transform:     isActive ? "translateY(-4px)" : "none",
                  boxShadow:     isActive ? "0 8px 20px rgba(0,0,0,0.25)" : "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <p style={{ margin: 0, fontSize: "12px", opacity: 0.9, textTransform: "capitalize" }}>
                  {card.label}
                </p>
                <h2 style={{ margin: "4px 0 0", fontWeight: 700 }}>{count}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card p-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ margin: 0 }}>
            {activeFilter === "all"
              ? "All Booking Records"
              : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings`}
          </h5>
          {activeFilter !== "all" && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => { setActiveFilter("all"); setCurrentPage(1); }}
            >
              Clear Filter
            </button>
          )}
        </div>
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

export default TotalBookings;