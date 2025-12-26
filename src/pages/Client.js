import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { getClients } from "../services/authService";

function Client() {
  const [clients, setClients] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Fetch clients from API
  const fetchClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleView = (client) => {
    setSelectedClient(client);
    setViewOpen(true);
  };

  // Table columns
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Mobile", accessor: "mobileNumber" },
    { header: "Gender", accessor: "gender" },
    { header: "Age", accessor: "age" },
    { header: "Role", accessor: "role" },
    { header: "Pref Name", accessor: "healthPrefNames" },
    { header: "Pref Icon", accessor: "healthPrefIcons" },
    { header: "Actions", accessor: "actions" },
  ];

  // Table data
  const data = clients.map((item) => ({
    ...item,
    healthPrefNames:
      item.health_preference && item.health_preference.length > 0
        ? item.health_preference.map((pref) => pref.preference_name).join(", ")
        : "N/A",
    healthPrefIcons:
      item.health_preference && item.health_preference.length > 0
        ? item.health_preference.map((pref) => (
            <img
              key={pref._id}
              src={`${process.env.REACT_APP_API_BASE_URL}/${pref.preference_icon}`}
              alt={pref.preference_name}
              width="60"
              className="me-1"
            />
          ))
        : "N/A",
    actions: (
      <div className="actions">
        <button className="view btn btn-primary btn-sm" onClick={() => handleView(item)}>
          View
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>CLIENT LIST</h2>
      </div>

      <Table columns={columns} data={data} rowsPerPage={10} />

      {/* VIEW MODAL */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Client Details" size="lg">
        {selectedClient && (
          <div className="container">
            <div className="row mb-2">
              <div className="col-md-6"><b>Name:</b> {selectedClient.name}</div>
              <div className="col-md-6"><b>Email:</b> {selectedClient.email}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6"><b>Mobile:</b> {selectedClient.mobileNumber}</div>
              <div className="col-md-6"><b>Gender:</b> {selectedClient.gender}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6"><b>Age:</b> {selectedClient.age}</div>
              <div className="col-md-6"><b>Role:</b> {selectedClient.role}</div>
            </div>

            <div className="row mb-2">
              <div className="col-md-6">
                <b>Health Preference Names:</b>
                <div>
                  {selectedClient.health_preference && selectedClient.health_preference.length > 0
                    ? selectedClient.health_preference.map((pref) => (
                        <div key={pref._id}>{pref.preference_name}</div>
                      ))
                    : "N/A"}
                </div>
              </div>
              <div className="col-md-6">
                <b>Health Preference Icons:</b>
                <div className="d-flex flex-wrap">
                  {selectedClient.health_preference && selectedClient.health_preference.length > 0
                    ? selectedClient.health_preference.map((pref) => (
                        <img
                          key={pref._id}
                          src={`${process.env.REACT_APP_API_BASE_URL}/${pref.preference_icon}`}
                          alt={pref.preference_name}
                          width="150"
                          className="me-2 mb-2"
                        />
                      ))
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="text-end mt-3">
              <button className="btn btn-secondary" onClick={() => setViewOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Client;
