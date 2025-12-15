import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import AppTutorialForm from "../forms/AppTutorialForm";

function AppTutorial() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [tutorialsList, setTutorialsList] = useState([]);

  // Sample Data
  useEffect(() => {
    const sampleData = [
      { id: 1, title: "Yoga Basics", description: "Intro to Hatha Yoga", status: "Published" },
      { id: 2, title: "Advanced Vinyasa", description: "Power Flow Yoga", status: "Draft" },
      { id: 3, title: "Meditation Techniques", description: "Mindfulness & Breathing", status: "Published" },
    ];
    setTutorialsList(sampleData);
  }, []);

  const handleView = (item) => {
    setSelectedTutorial(item);
    setViewOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedTutorial(item);
    setEditOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this tutorial?")) return;
    setTutorialsList(tutorialsList.filter((t) => t.id !== id));
  };

  const handleSubmit = (data) => {
    if (selectedTutorial && editOpen) {
      setTutorialsList(tutorialsList.map((t) => (t.id === selectedTutorial.id ? { ...t, ...data } : t)));
    } else {
      const newId = tutorialsList.length ? tutorialsList[tutorialsList.length - 1].id + 1 : 1;
      setTutorialsList([...tutorialsList, { id: newId, ...data }]);
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = tutorialsList.map((item) => ({
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
        <h2>APP TUTORIALS</h2>
        <Button text="+ Add Tutorial" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={tableData} rowsPerPage={5} />

      {/* ADD */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Tutorial" size="lg">
        <AppTutorialForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Tutorial" size="lg">
        <AppTutorialForm
          onClose={() => setEditOpen(false)}
          initialData={selectedTutorial}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* VIEW */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Tutorial Details" size="md">
        {selectedTutorial && (
          <div style={{ padding: "10px" }}>
            <p><b>Title:</b> {selectedTutorial.title}</p>
            <p><b>Description:</b> {selectedTutorial.description}</p>
            <p><b>Status:</b> {selectedTutorial.status}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AppTutorial;
