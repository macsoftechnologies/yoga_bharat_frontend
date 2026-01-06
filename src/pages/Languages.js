import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import { getLanguages, addLanguage, updateLanguage, deleteLanguage, getLanguageById } from "../services/authService";
import "../forms/form.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function Languages() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [languagesList, setLanguagesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  

  // FETCH LANGUAGES

  const fetchLanguages = async (page) => {
    try {
      const res = await getLanguages(page, 10);
      console.log("Languages response:", res);

      let data = [];
      let pages = 1;

      if (res && Array.isArray(res.data)) {
        data = res.data;
        pages = res.totalPages || 1;
      }
      else if (Array.isArray(res)) {
        data = res;
      }

      setLanguagesList(data);
      setTotalPages(pages);
    } catch (err) {
      console.error(err);
      setLanguagesList([]);
      setTotalPages(1);
      Swal.fire("Error", "Failed to fetch languages", "error");
    }
  };


  useEffect(() => {
    fetchLanguages(currentPage);
  }, [currentPage]);

  // ADD / UPDATE
  const handleSubmit = async (data) => {
    try {
      if (selectedItem && editOpen) {
        const payload = {
          languageId: selectedItem.languageId,
          language_name: data.language_name,
          special_character: data.special_character,
        };
        const response = await updateLanguage(payload);
        Swal.fire({
          title: "Updated!",
          text: response.message || "Language updated successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          color: "#ffffff", 
          background: "#35a542",
        });
      } else {
        // Add
        const response = await addLanguage(data);
        Swal.fire({
          title: "Added!",
          text: response.message || "Language added successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          color: "#ffffff", 
          background: "#35a542",
        });
      }
      fetchLanguages();
      setOpen(false);
      setEditOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  // EDIT 
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleView = async (languageId) => {
    try {
      const res = await getLanguageById(languageId);
      const languageData = res.data; 
      setSelectedItem(languageData);
      setViewOpen(true);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch language details", "error");
    }
  };

  // DELETE
  const handleDelete = async (languageId) => {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This language will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#35a542", 
    cancelButtonColor: "#ff7a00",
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await deleteLanguage(languageId);

    Swal.fire({
      title: "Deleted!",
      text: res.message || "Language deleted successfully",
      icon: "success",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
      background: "#ff7a00",
      color: "#ffffff",
    });

    fetchLanguages();
  } catch (err) {
    console.error(err);
    Swal.fire(
      "Error",
      err.response?.data?.message || "Delete failed",
      "error"
    );
  }
  };

  // TABLE CONFIG
  const columns = [
    { header: "Language Name", accessor: "language_name" },
    { header: "Special Character", accessor: "special_character" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = Array.isArray(languagesList) ? languagesList.map((item) => ({
  ...item,
  actions: (
    <div className="actions">
        <button
          className="icon-btn view"
          title="View"
          onClick={() => handleView(item.languageId)}
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
          onClick={() => handleDelete(item.languageId)}
        >
          <FaTrash />
        </button>
      </div>
  ),
  })) : [];


  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Languages</h2>
        <Button text="+ Add Language" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Language" size="lg">
        <LanguageForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Language" size="lg">
        <LanguageForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Language Details"
        size="md"
      >
        {selectedItem && (
            <div style={{ padding: "10px" }}>
              <p><b>Language:</b> {selectedItem.language_name}</p>
              <p><b>Special Character:</b> {selectedItem.special_character}</p>

              <button
                className="btn btn-secondary mt-2"
                onClick={() => setViewOpen(false)}
              >
                Close
              </button>
            </div>
          )}

      </Modal>

    </div>
  );
}
//  FORM
function LanguageForm({ onClose, initialData, isEdit, onSubmit }) {
  const [languageName, setLanguageName] = useState(initialData?.language_name || "");
  const [specialChar, setSpecialChar] = useState(initialData?.special_character || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ language_name: languageName, special_character: specialChar });
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Language Name</label>
        <input
          type="text"
          className="form-control"
          value={languageName}
          onChange={(e) => setLanguageName(e.target.value)}
          placeholder="Enter language"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Special Character</label>
        <input
          type="text"
          className="form-control"
          value={specialChar}
          onChange={(e) => setSpecialChar(e.target.value)}
          placeholder="Enter special character"
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
