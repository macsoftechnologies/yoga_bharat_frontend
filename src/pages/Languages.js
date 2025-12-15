import React, { useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import "../forms/form.css";

function Languages() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [languagesList, setLanguagesList] = useState([
    { id: 1, language: "English", description: "Yoga instructions in English" },
    { id: 2, language: "Hindi", description: "Yoga instructions in Hindi" },
  ]);

  const handleSubmit = (data) => {
    if (selectedItem && editOpen) {
      setLanguagesList(languagesList.map((item) => (item.id === selectedItem.id ? { ...item, ...data } : item)));
    } else {
      const newId = languagesList.length ? languagesList[languagesList.length - 1].id + 1 : 1;
      setLanguagesList([...languagesList, { id: newId, ...data }]);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this language?")) return;
    setLanguagesList(languagesList.filter((l) => l.id !== id));
  };

  const columns = [
    { header: "Language", accessor: "language" },
    { header: "Description", accessor: "description" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = languagesList.map((item) => ({
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
        <h2>Languages</h2>
        <Button text="+ Add Language" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={tableData} rowsPerPage={5} />

      {/* ADD MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Language" size="lg">
        <LanguageForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Language" size="lg">
        <LanguageForm
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
function LanguageForm({ onClose, initialData, isEdit, onSubmit }) {
  const [language, setLanguage] = useState(initialData?.language || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ language, description });
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Language</label>
        <input
          type="text"
          className="form-control"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Enter language"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
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

export default Languages;
