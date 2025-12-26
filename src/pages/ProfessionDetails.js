import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ProfessionDetailsForm from "../forms/ProfessionDetailsForm";

function ProfessionDetails() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [list, setList] = useState([]);

  // Sample Data
  useEffect(() => {
    const sampleData = [
      { id: 1, name: "Ramesh Kumar", profession: "Yoga Trainer", experience: "5", skills: "Yoga, Meditation", status: "Active" },
      { id: 2, name: "Priya Sharma", profession: "Physiotherapist", experience: "3", skills: "Rehabilitation, Stretching", status: "Inactive" },
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
    if (!window.confirm("Delete this record?")) return;
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
    { header: "Name", accessor: "name" },
    { header: "Profession", accessor: "profession" },
    { header: "Experience", accessor: "experience" },
    { header: "Skills", accessor: "skills" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = list.map((item) => ({
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
        <h2>PROFESSION DETAILS</h2>
        <Button text="+ Add Profession" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={tableData} rowsPerPage={10} />

      {/* ADD */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Profession" size="lg">
        <ProfessionDetailsForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profession" size="lg">
        <ProfessionDetailsForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* VIEW */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Profession Details" size="md">
        {selectedItem && (
          <div style={{ padding: "10px" }}>
            <p><b>Name:</b> {selectedItem.name}</p>
            <p><b>Profession:</b> {selectedItem.profession}</p>
            <p><b>Experience:</b> {selectedItem.experience} Years</p>
            <p><b>Skills:</b> {selectedItem.skills}</p>
            <p><b>Status:</b> {selectedItem.status}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ProfessionDetails;
