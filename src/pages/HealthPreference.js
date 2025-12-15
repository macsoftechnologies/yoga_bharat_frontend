import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import HealthPreferenceForm from "../forms/HealthPreferenceForm";

function HealthPreference() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [list, setList] = useState([]);

  // Sample Data
  useEffect(() => {
    const sampleData = [
      { id: 1, name: "Ramesh", age: 32, gender: "Male", injuries: "Back pain", allergies: "None", healthConditions: "Hypertension", goals: "Flexibility" },
      { id: 2, name: "Priya", age: 28, gender: "Female", injuries: "Knee injury", allergies: "Pollen", healthConditions: "Asthma", goals: "Stress Relief" },
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
    { header: "Age", accessor: "age" },
    { header: "Gender", accessor: "gender" },
    { header: "Goals", accessor: "goals" },
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
        <h2>HEALTH PREFERENCE LIST</h2>
        <Button text="+ Add Health Preference" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={tableData} rowsPerPage={5} />

      {/* ADD */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Health Preference" size="lg">
        <HealthPreferenceForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Health Preference" size="lg">
        <HealthPreferenceForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* VIEW */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Health Preference Details" size="md">
        {selectedItem && (
          <div style={{ padding: "10px" }}>
            <p><b>Name:</b> {selectedItem.name}</p>
            <p><b>Age:</b> {selectedItem.age}</p>
            <p><b>Gender:</b> {selectedItem.gender}</p>
            <p><b>Goals:</b> {selectedItem.goals}</p>
            <p><b>Injuries:</b> {selectedItem.injuries}</p>
            <p><b>Allergies:</b> {selectedItem.allergies}</p>
            <p><b>Health Conditions:</b> {selectedItem.healthConditions}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default HealthPreference;
