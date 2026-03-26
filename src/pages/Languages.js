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
  const [totalCount, setTotalCount] = useState(0); // ✅ Total records
  const [limit, setLimit] = useState(10); // ✅ Records per page
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    fetchLanguages(currentPage, limit);
  }, [currentPage, limit]);

  const fetchLanguages = async (page, limitValue) => {
    setLoading(true); 
    try {
      const res = await getLanguages(page, limitValue);

      let data = [];
      let pages = 1;
      let total = 0;

      if (res && Array.isArray(res.data)) {
        data = res.data;
        pages = res.totalPages || 1;
        total = res.totalCount || data.length;
      } else if (Array.isArray(res)) {
        data = res;
        total = data.length;
      }

      setLanguagesList(data);
      setTotalPages(pages);
      setTotalCount(total);
    } catch (err) {
      console.error(err);
      setLanguagesList([]);
      setTotalPages(1);
      setTotalCount(0);
      Swal.fire("Error", "Failed to fetch languages", "error");
    } finally {
      setLoading(false); 
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

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
      fetchLanguages(currentPage, limit);
      setOpen(false);
      setEditOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleView = async (languageId) => {
    try {
      const res = await getLanguageById(languageId);
      setSelectedItem(res.data);
      setViewOpen(true);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch language details", "error");
    }
  };

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
      fetchLanguages(currentPage, limit);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
    }
  };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "Language Name", accessor: "language_name" },
    { header: "Special Character", accessor: "special_character" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = Array.isArray(languagesList)
    ? languagesList.map((item, index) => ({
        srNo: (currentPage - 1) * limit + index + 1,
        ...item,
        actions: (
          <div className="actions">
            <button className="icon-btn view" title="View" onClick={() => handleView(item.languageId)}>
              <FaEye />
            </button>
            <button className="icon-btn edit" title="Edit" onClick={() => handleEdit(item)}>
              <FaEdit />
            </button>
            <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(item.languageId)}>
              <FaTrash />
            </button>
          </div>
        ),
      }))
    : [];

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>LANGUAGES</h2>
        <Button text="+ Add Language" color="orange" onClick={() => setOpen(true)} />
      </div>

      {/* ✅ Records per page + Showing X of Y records */}
      <div className="d-flex align-items-center justify-content-between mb-2 p-2">
        <div className="d-flex align-items-center gap-2">
          <label style={{ fontSize: "15px", color: "#666", whiteSpace: "nowrap" }}>
            Records per page:
          </label>
          <select
            className="form-select form-select-sm"
            style={{ border: "2px solid #ff7a00", padding: "2px", cursor: "pointer", width: "75px" }}
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <span style={{ fontSize: "16px" }}>
          Showing <strong style={{ color: "#ff7a00" }}>{languagesList.length}</strong>{" "}
          {totalCount > languagesList.length && <>of <strong>{totalCount}</strong></>} records
        </span>
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Language" size="md">
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

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Language Details" size="md">
        {selectedItem && (
          <div style={{ padding: "10px" }}>
            <p><b>Language:</b> {selectedItem.language_name}</p>
            <p><b>Special Character:</b> {selectedItem.special_character}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

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