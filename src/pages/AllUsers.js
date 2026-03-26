import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { getClients } from "../services/authService";
import { useNavigate } from "react-router-dom";

function AllUsers() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients(currentPage, limit);
  }, [currentPage, limit]);

  const fetchClients = async (page, lim) => {
    setLoading(true);
    try {
      const res = await getClients(page, lim);

      if (Array.isArray(res)) {
        setClients(res);
        setTotalPages(1);
        setTotalCount(res.length);
      } else if (res && Array.isArray(res.data)) {
        setClients(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || res.data.length);
      } else {
        setClients([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err) {
      setClients([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // When limit changes, reset to page 1
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToProfile = (userId) => {
    navigate(`/client/${userId}`);
  };

  const columns = [
    { header: "S.No",      accessor: "srNo" },
    { header: "Name",      accessor: "name" },
    { header: "Email",     accessor: "email" },
    { header: "Mobile",    accessor: "mobileNumber" },
    { header: "Gender",    accessor: "gender" },
    { header: "Age",       accessor: "age" },
    { header: "Role",      accessor: "role" },
    { header: "Health Preference", accessor: "healthPrefNames" },
    // { header: "Health Preference Icon", accessor: "healthPrefIcons" },
  ];

  const tableData = clients.map((item, index) => ({
    _rowonClick: () => goToProfile(item.userId),

    srNo: (currentPage - 1) * limit + index + 1,
    name: item.name,
    email: item.email,
    mobileNumber: item.mobileNumber,
    gender: item.gender,
    age: item.age,
    role: item.role,

    healthPrefNames:
      item.health_preference?.length > 0
        ? item.health_preference.map((p) => p.preference_name).join(", ")
        : "N/A",

    healthPrefIcons:
      item.health_preference?.length > 0
        ? item.health_preference.map((pref) => (
            <img
              key={pref._id}
              src={`${process.env.REACT_APP_API_BASE_URL}/${pref.preference_icon}`}
              alt={pref.preference_name}
              width="50"
              className="me-1"
            />
          ))
        : "N/A",
  }));

  return (
    <div>
      {/* ── Header Row ── */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>ALL USERS</h2>

        {/* Records per page */}
        <div className="d-flex align-items-center gap-2">
          <label
            style={{ fontSize: "15px", color: "#666", whiteSpace: "nowrap" }}
          >
            Records per page:
          </label>
          <select
            className="form-select form-select-sm"
              style={{
              border: "2px solid #ff7a00",
              padding: "2px",
              cursor: "pointer",
              width: "75px"
            }}
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* ── Info Row ── */}
      <div
        className="d-flex align-items-center justify-content-between mb-3"
       style={{ fontSize: "16px", marginTop: "20px", color: "#000" }}
      >
        {/* Row click hint */}
        <span style={{ color: "#ff7a00", fontSize: "16px", fontStyle: "italic" }}>
          💡 Click on any row to view profile →
        </span>
        <span>
          Showing{" "}
          <strong style={{ color: "#ff7a00" }}>{clients.length}</strong>{" "}
          {totalCount > clients.length ? (
            <>of <strong>{totalCount}</strong></>
          ) : null}{" "}
          records
        </span>
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />
    </div>
  );
}

export default AllUsers;