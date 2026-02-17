import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import {
  addTerms,
  getTerms,
  getTermsById,
  updateTerms,
  // deleteTerms,
} from "../services/authService";
import "../forms/form.css";
import { FaEye, FaEdit } from "react-icons/fa";

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

      let data = [];
      let pages = 1;

      if (res && Array.isArray(res.data)) {
        data = res.data;
        pages = res.totalPages || 1;
      } else if (Array.isArray(res)) {
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
    fetchTerms(currentPage);
  };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "User Type", accessor: "usertype" },
    { header: "Text", accessor: "text" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = termsList.map((item, index) => ({
    srNo: (currentPage - 1) * 10 + index + 1,
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
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Terms & Conditions</h2>
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Terms" size="md">
        <TermsForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Terms" size="md">
        <TermsForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit={true}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="View Terms" size="md">
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

function TermsForm({ onClose, initialData, isEdit, onSubmit }) {
  const [text, setText] = useState("");
  const [usertype, setUsertype] = useState("");

  useEffect(() => {
    if (initialData) {
      setText(initialData.text || "");
      setUsertype(initialData.usertype || "");
    } else {
      setText("");
      setUsertype("");
    }
  }, [initialData]);

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
          className="form-select"
          value={usertype}
          onChange={(e) => setUsertype(e.target.value)}
          required
          disabled={isEdit}
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
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
        >
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
