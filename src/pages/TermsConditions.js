import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import {
  addTerms,
  getTerms,
  getTermsById,
  updateTerms,
  deleteTerms,
} from "../services/authService";
import "../forms/form.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function TermsConditions() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [termsList, setTermsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
    fetchTerms(currentPage);
  }, [currentPage]);

  const fetchTerms = async (page) => {
    try {
      const res = await getTerms(page, 10);
      console.log("Terms response:", res);

      let data = [];
      let pages = 1;
      if (res && Array.isArray(res.data)) {
        data = res.data;
        pages = res.totalPages || 1;
      }
      else if (Array.isArray(res)) {
        data = res;
      }

      setTermsList(data);
      setTotalPages(pages);
    } catch (err) {
      console.error(err);
      setTermsList([]);
      setTotalPages(1);
      Swal.fire("Error", "Failed to fetch terms", "error");
    }
  };

  const handleView = async (termsId) => {
    try {
      const res = await getTermsById(termsId);
      setSelectedItem(res.data);
      setViewOpen(true);
    } catch {
      Swal.fire("Error", "Failed to fetch details", "error");
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleDelete = async (termsId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This Terms & Conditions will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff7a00",
      cancelButtonColor: "#28a745",
    });

    if (!confirm.isConfirmed) return;

    const res = await deleteTerms(termsId);

    Swal.fire({
      title: "Deleted!",
      text: res.message || "Terms deleted successfully",
      icon: "success",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
      background: "#ff7a00",
      color: "#ffffff",
    });

    fetchTerms();
  };

  const handleSubmit = async (data) => {
    let res;

    if (selectedItem && editOpen) {
      res = await updateTerms({
        termsId: selectedItem.termsId,
        ...data,
      });

      Swal.fire({
        title: "Updated!",
        text: res.message || "Terms updated successfully",
        icon: "success",
        iconColor: "#22c8d8",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
        background: "#35a542",
        color: "#ffffff",
      });
    } else {
      res = await addTerms(data);

      Swal.fire({
        title: "Added!",
        text: res.message || "Terms added successfully",
        icon: "success",
        iconColor: "#22c8d8",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
        background: "#35a542",
        color: "#ffffff",
      });
    }

    setOpen(false);
    setEditOpen(false);
    setSelectedItem(null);
    fetchTerms();
  };

  const columns = [
    { header: "User Type", accessor: "usertype" },
    { header: "Text", accessor: "text" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = termsList.map((item) => ({
    ...item,
    actions: (
      <div className="actions">
        <button
          className="icon-btn view"
          title="View"
          onClick={() => handleView(item.termsId)}
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
          onClick={() => handleDelete(item.termsId)}
        >
          <FaTrash />
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Terms & Conditions</h2>
        <Button text="+ Add Terms" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Terms" size="lg">
        <TermsForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Terms" size="lg">
        <TermsForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>
      
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="View Terms"  size="md">
        {selectedItem && (
          <div style={{ padding: 10 }}>
            <p><b>User Type:</b> {selectedItem.usertype}</p>
            <p><b>Text:</b> {selectedItem.text}</p>
            <button className="btn btn-secondary" onClick={() => setViewOpen(false)}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* FORM */
function TermsForm({ onClose, initialData, isEdit, onSubmit }) {
  const [text, setText] = useState(initialData?.text || "");
  const [usertype, setUsertype] = useState(initialData?.usertype || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text, usertype });
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">User Type</label>
        <select
          className="form-control"
          value={usertype}
          onChange={(e) => setUsertype(e.target.value)}
          required
        >
          <option value="">Select User Type</option>
          <option value="client">Client</option>
          <option value="trainer">Trainer</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Terms Text</label>
        <textarea
          className="form-control"
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>

      <div className="text-end">
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
