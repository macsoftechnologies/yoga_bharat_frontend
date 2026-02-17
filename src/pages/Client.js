import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { getClients } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Client() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClients(currentPage);
  }, [currentPage]);

  const fetchClients = async (page) => {
    try {
      const res = await getClients(page, 10);

      if (Array.isArray(res)) {
        setClients(res);
        setTotalPages(1);
      } else if (res && Array.isArray(res.data)) {
        setClients(res.data);
        setTotalPages(res.totalPages || 1);
      } else {
        setClients([]);
        setTotalPages(1);
      }
    } catch (err) {
      setClients([]);
      setTotalPages(1);
    }
  };

  const goToProfile = (userId) => {
    navigate(`/client/${userId}`);
  };

  const cellStyle = { cursor: "pointer" };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Mobile", accessor: "mobileNumber" },
    { header: "Gender", accessor: "gender" },
    { header: "Age", accessor: "age" },
    { header: "Role", accessor: "role" },
    { header: "Pref Name", accessor: "healthPrefNames" },
    { header: "Pref Icon", accessor: "healthPrefIcons" },
  ];

  const tableData = clients.map((item, index) => ({
    srNo: (
      <span
        style={{ cursor: "pointer", color: "#6f42c1", fontWeight: "600" }}
        onClick={() => goToProfile(item.userId)}
      >
        {(currentPage - 1) * 10 + index + 1}
      </span>
    ),

    name: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.name}
      </span>
    ),

    email: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.email}
      </span>
    ),

    mobileNumber: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.mobileNumber}
      </span>
    ),

    gender: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.gender}
      </span>
    ),

    age: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.age}
      </span>
    ),

    role: (
      <span style={cellStyle} onClick={() => goToProfile(item.userId)}>
        {item.role}
      </span>
    ),

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
      <h2 className="mb-3">CLIENT LIST</h2>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Client;
