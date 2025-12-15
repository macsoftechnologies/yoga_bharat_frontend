import React, { useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import "../forms/form.css";

function TermsConditions() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [termsList, setTermsList] = useState([
    {
      id: 1,
      title: "General Terms",
      description: "All users must follow yoga class rules and maintain discipline.",
    },
  ]);

  // Add/Edit submission
  const handleSubmit = (data) => {
    if (selectedItem && editOpen) {
      setTermsList(termsList.map((item) => (item.id === selectedItem.id ? { ...item, ...data } : item)));
    } else {
      const newId = termsList.length ? termsList[termsList.length - 1].id + 1 : 1;
      setTermsList([...termsList, { id: newId, ...data }]);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this term?")) return;
    setTermsList(termsList.filter((t) => t.id !== id));
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = termsList.map((item) => ({
    ...item,
    actions: (
      <div className="actions">
        <button className="edit" onClick={() => handleEdit(item)}>Edit</button>
        <button className="delete" onClick={() => handleDelete(item.id)}>Delete</button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Terms & Conditions</h2>
        <Button text="+ Add Term" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={tableData} rowsPerPage={5} />

      {/* ADD MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Term" size="lg">
        <TermForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Term" size="lg">
        <TermForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}

// Reusable form inside same file
function TermForm({ onClose, initialData, isEdit, onSubmit }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ title, description });
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          placeholder="Enter description"
          required
        />
      </div>
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {isEdit ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}

export default TermsConditions;
