import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
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
  const [totalCount, setTotalCount] = useState(0); // ✅ Added
  const [limit, setLimit] = useState(10); // ✅ Records per page
  const [loading, setLoading] = useState(false);

  // Fetch terms when page or limit changes
  useEffect(() => {
    fetchTerms(currentPage, limit);
  }, [currentPage, limit]);

  const fetchTerms = async (page, limitValue) => {
    setLoading(true);
    try {
      const res = await getTerms(page, limitValue);
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

      setTermsList(data);
      setTotalPages(pages);
      setTotalCount(total); // ✅ Added
    } catch (err) {
      console.error(err);
      setTermsList([]);
      setTotalPages(1);
      setTotalCount(0); // ✅ Added
      Swal.fire("Error", "Failed to fetch terms", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This terms & condition will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteTerms(termsId);
        Swal.fire({
          title: "Deleted!",
          text: "Terms & condition deleted successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          background: "#d33",
          color: "#ffffff",
        });
        await fetchTerms(currentPage, limit);
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedItem && editOpen) {
        await updateTerms({
          termsId: selectedItem.termsId,
          terms_and_conditions: data.terms_and_conditions,
          usertype: data.usertype,
        });

        setTermsList((prev) =>
          prev.map((item) =>
            item.termsId === selectedItem.termsId
              ? { ...item, terms_and_conditions: data.terms_and_conditions, usertype: data.usertype }
              : item
          )
        );

        setEditOpen(false);
        setSelectedItem(null);

        Swal.fire({
          title: "Updated!",
          text: "Terms updated successfully",
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
        await addTerms({
          terms_and_conditions: data.terms_and_conditions,
          usertype: data.usertype,
        });
        setOpen(false);
        setSelectedItem(null);
        await fetchTerms(currentPage, limit);
        Swal.fire({
          title: "Added!",
          text: "Terms added successfully",
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
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "User Type", accessor: "usertype" },
    { header: "Terms", accessor: "displayText" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = Array.isArray(termsList)
    ? termsList.map((item, index) => {
        const termsText = item.terms_and_conditions || "-";
        return {
          srNo: (currentPage - 1) * limit + index + 1, // ✅ Updated S.No with limit
          ...item,
          displayText: (
            <span
              title={termsText}
              style={{
                display: "block",
                maxWidth: "400px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
            >
              {termsText}
            </span>
          ),
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
        };
      })
    : [];

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>TERMS & CONDITIONS</h2>
        <Button text="+ Add TERMS & CONDITIONS" color="orange" onClick={() => setOpen(true)} />
      </div>

      {/* ✅ Records per page + Showing count */}
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
          Showing <strong style={{ color: "#ff7a00" }}>{termsList.length}</strong>{" "}
          {totalCount > termsList.length && <>of <strong>{totalCount}</strong></>} records
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

      <Modal open={open} onClose={() => setOpen(false)} title="Add Terms" size="md">
        <TermsForm onClose={() => setOpen(false)} onSubmit={handleSubmit} isEdit={false} />
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
            <p><b>Terms:</b> {selectedItem.terms_and_conditions}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function TermsForm({ onClose, initialData, isEdit, onSubmit }) {
  const [terms_and_conditions, setTermsAndConditions] = useState("");
  const [usertype, setUsertype] = useState("");

  useEffect(() => {
    if (initialData) {
      setTermsAndConditions(initialData.terms_and_conditions || initialData.text || "");
      setUsertype(initialData.usertype || "");
    } else {
      setTermsAndConditions("");
      setUsertype("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ terms_and_conditions, usertype });
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
          value={terms_and_conditions}
          onChange={(e) => setTermsAndConditions(e.target.value)}
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