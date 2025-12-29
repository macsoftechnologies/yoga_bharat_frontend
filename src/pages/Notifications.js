import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import NotificationsForm from "../forms/NotificationsForm";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function Notifications() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [list, setList] = useState([]);

  // Sample Data
  useEffect(() => {
    const sampleData = [
      { id: 1, title: "New Yoga Session", message: "Join the morning Hatha Yoga class at 7 AM.", recipient: "All Users", status: "Unread" },
      { id: 2, title: "Payment Reminder", message: "Your subscription payment is due tomorrow.", recipient: "Ramesh Kumar", status: "Read" },
      { id: 3, title: "Event Update", message: "The Yoga workshop has been rescheduled to Saturday.", recipient: "All Users", status: "Unread" },
    ];
    setList(sampleData);
  }, []);

  // VIEW
  const handleView = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  // EDIT
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  // DELETE
  const handleDelete = (id) => {
    if (!window.confirm("Delete this notification?")) return;
    setList(list.filter((i) => i.id !== id));
  };

  // ADD / UPDATE
  const handleSubmit = (data) => {
    if (selectedItem && editOpen) {
      setList(list.map((i) => (i.id === selectedItem.id ? { ...i, ...data } : i)));
    } else {
      const newId = list.length ? list[list.length - 1].id + 1 : 1;
      setList([...list, { id: newId, ...data }]);
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Message", accessor: "message" },
    { header: "Recipient", accessor: "recipient" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = list.map((item) => ({
    ...item,
    actions: (
      <div className="actions">
        <button
          className="icon-btn view"
          title="View"
          onClick={() => handleView(item)}
        >
          <FaEye />
        </button>

        <button
          className="icon-btn edit"
          title="Edit"
          onClick={() => handleEdit(item)}
        >
          <FaEdit />
        </button>

        <button
          className="icon-btn delete"
          title="Delete"
          onClick={() => handleDelete(item.id)}
        >
          <FaTrash />
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>NOTIFICATIONS</h2>
        <Button text="+ Add Notification" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={tableData} rowsPerPage={10} />

      {/* ADD */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Notification" size="lg">
        <NotificationsForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Notification" size="lg">
        <NotificationsForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* VIEW */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Notification Details" size="md">
        {selectedItem && (
          <div style={{ padding: "10px" }}>
            <p><b>Title:</b> {selectedItem.title}</p>
            <p><b>Message:</b> {selectedItem.message}</p>
            <p><b>Recipient:</b> {selectedItem.recipient}</p>
            <p><b>Status:</b> {selectedItem.status}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Notifications;
