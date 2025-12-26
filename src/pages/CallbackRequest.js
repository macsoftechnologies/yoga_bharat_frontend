import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import CallbackRequestForm from "../forms/CallbackRequestForm";

function CallbackRequest() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestList, setRequestList] = useState([]);

  // Sample data
  useEffect(() => {
    const sampleData = [
      { id: 1, clientName: "Ramesh Kumar", mobileNumber: "9876543210", preferredTime: "10:00", yogaType: "Hatha", notes: "Beginner level" },
      { id: 2, clientName: "Priya Sharma", mobileNumber: "9123456780", preferredTime: "15:30", yogaType: "Vinyasa", notes: "Advanced level" },
    ];
    setRequestList(sampleData);
  }, []);

  const handleView = (item) => {
    setSelectedRequest(item);
    setViewOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedRequest(item);
    setEditOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this request?")) return;
    setRequestList(requestList.filter((r) => r.id !== id));
  };

  const handleSubmit = (data) => {
    if (selectedRequest && editOpen) {
      setRequestList(requestList.map((r) => (r.id === selectedRequest.id ? { ...r, ...data } : r)));
    } else {
      const newId = requestList.length ? requestList[requestList.length - 1].id + 1 : 1;
      setRequestList([...requestList, { id: newId, ...data }]);
    }
  };

  const columns = [
    { header: "Client Name", accessor: "clientName" },
    { header: "Mobile Number", accessor: "mobileNumber" },
    { header: "Preferred Time", accessor: "preferredTime" },
    { header: "Yoga Type", accessor: "yogaType" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = requestList.map((item) => ({
    ...item,
    actions: (
      <div className="actions">
        <button className="view" onClick={() => handleView(item)}>View</button>
        <button className="edit" onClick={() => handleEdit(item)}>Edit</button>
        <button className="delete" onClick={() => handleDelete(item.id)}>Delete</button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>CALLBACK REQUESTS</h2>
        <Button text="+ Add Request" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={tableData} rowsPerPage={10} />

      {/* ADD */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Callback Request" size="lg">
        <CallbackRequestForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Callback Request" size="lg">
        <CallbackRequestForm
          onClose={() => setEditOpen(false)}
          initialData={selectedRequest}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* VIEW */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Request Details" size="md">
        {selectedRequest && (
          <div style={{ padding: "10px" }}>
            <p><b>Client Name:</b> {selectedRequest.clientName}</p>
            <p><b>Mobile Number:</b> {selectedRequest.mobileNumber}</p>
            <p><b>Preferred Time:</b> {selectedRequest.preferredTime}</p>
            <p><b>Yoga Type:</b> {selectedRequest.yogaType}</p>
            <p><b>Notes:</b> {selectedRequest.notes}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CallbackRequest;
