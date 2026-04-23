import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Swal from "sweetalert2";
import {
  addCategory,
  getCategoryList,
  CategoryById,
  updateCategory,
  deleteCategory,
  DisbleEnableCategory,
} from "../services/authService";
import "../forms/form.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function Category() {
  const [open,          setOpen]          = useState(false);
  const [editOpen,      setEditOpen]      = useState(false);
  const [viewOpen,      setViewOpen]      = useState(false);
  const [selectedItem,  setSelectedItem]  = useState(null);
  const [editItem,      setEditItem]      = useState(null);
  const [categoryList,  setCategoryList]  = useState([]);
  const [currentPage,   setCurrentPage]   = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);
  const [totalCount,    setTotalCount]    = useState(0);
  const [limit,         setLimit]         = useState(10);
  const [loading,       setLoading]       = useState(false);

  useEffect(() => {
    fetchCategories(currentPage, limit);
  }, [currentPage, limit]);

  const fetchCategories = async (page, limitValue) => {
    setLoading(true);
    try {
      const res = await getCategoryList(page, limitValue);
      let data = [], pages = 1, total = 0;
      if (res && Array.isArray(res.data)) {
        data = res.data; pages = res.totalPages || 1; total = res.totalCount || data.length;
      } else if (Array.isArray(res)) {
        data = res; total = data.length;
      }
      setCategoryList(data);
      setTotalPages(pages);
      setTotalCount(total);
    } catch (err) {
      console.error(err);
      setCategoryList([]);
      setTotalPages(1);
      setTotalCount(0);
      Swal.fire("Error", "Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  // ── View ──────────────────────────────────────────────────────────────────
  const handleView = async (categoryId) => {
    try {
      const res = await CategoryById(categoryId);
      setSelectedItem(res.data || res);
      setViewOpen(true);
    } catch {
      Swal.fire("Error", "Failed to fetch details", "error");
    }
  };

  // ── Add ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (data) => {
    try {
      await addCategory({ category_name: data.category_name });
      setOpen(false);
      await fetchCategories(currentPage, limit);
      Swal.fire({
        title: "Added!", text: "Category added successfully", icon: "success",
        position: "top-end", toast: true, showConfirmButton: false,
        timer: 3000, timerProgressBar: true, background: "#35a542", color: "#ffffff",
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  // ── Edit (open modal) ─────────────────────────────────────────────────────
  const handleEditOpen = (item) => {
    setEditItem(item);
    setEditOpen(true);
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = async (data) => {
  try {
    const payload = {
      categoryId: editItem.categoryId,
      category_name: data.category_name,
    };

    await updateCategory(payload);

    setEditOpen(false);
    setEditItem(null);
    await fetchCategories(currentPage, limit);

    Swal.fire({
      title: "Updated!",
      text: "Category updated successfully",
      icon: "success",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#35a542",
      color: "#ffffff",
    });
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
  }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: `Are you sure you want to delete "${item.category_name}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteCategory(item.categoryId);
      await fetchCategories(currentPage, limit);
      Swal.fire({
        title: "Deleted!", text: "Category deleted successfully", icon: "success",
        position: "top-end", toast: true, showConfirmButton: false,
        timer: 3000, timerProgressBar: true, background: "#d33", color: "#ffffff",
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
    }
  };

  // ── Enable / Disable toggle ───────────────────────────────────────────────
  const handleToggleStatus = async (item) => {
    const isCurrentlyEnabled = item.category_status === "enable";
    const newStatus          = isCurrentlyEnabled ? "disable" : "enable";
    const actionText         = isCurrentlyEnabled ? "Disable" : "Enable";
    const actionColor        = isCurrentlyEnabled ? "#d33"    : "#28a745";

    const result = await Swal.fire({
      title: `${actionText} Category?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} "${item.category_name}"?`,
      icon: isCurrentlyEnabled ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: actionColor,
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      await DisbleEnableCategory(item.categoryId, newStatus);

      // Optimistic update
      setCategoryList((prev) =>
        prev.map((c) =>
          c.categoryId === item.categoryId
            ? { ...c, category_status: newStatus }
            : c
        )
      );

      Swal.fire({
        toast: true, position: "top-end",
        icon: isCurrentlyEnabled ? "warning" : "success",
        title: `Category ${actionText}d`,
        showConfirmButton: false, timer: 3000, timerProgressBar: true,
        background: actionColor, color: "#ffffff",
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || `${actionText} failed`, "error");
    }
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    { header: "S.No",          accessor: "srNo" },
    { header: "Category Name", accessor: "category_name" },
    { header: "Status",        accessor: "statusBadge" },
    { header: "Actions",       accessor: "actions" },
  ];

  const tableData = Array.isArray(categoryList)
    ? categoryList.map((item, index) => ({
        srNo: (currentPage - 1) * limit + index + 1,
        ...item,

        // ── Status: clickable toggle badge ──────────────────────────────────
        statusBadge: (
          <span
            onClick={() => handleToggleStatus(item)}
            title={`Click to ${item.category_status === "enable" ? "disable" : "enable"}`}
            style={{
              display: "inline-block",
              padding: "3px 12px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              userSelect: "none",
              transition: "all 0.2s",
              background: item.category_status === "enable" ? "#d4edda" : "#f8d7da",
              color:      item.category_status === "enable" ? "#155724" : "#721c24",
              border:     item.category_status === "enable"
                ? "1px solid #c3e6cb"
                : "1px solid #f5c6cb",
              textTransform: "capitalize",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.75";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            {item.category_status === "enable" ? "Enabled" : "Disabled"}
          </span>
        ),

        // ── Actions: View, Edit, Delete ─────────────────────────────────────
        actions: (
          <div className="actions">
            <button
              className="icon-btn view"
              title="View"
              onClick={() => handleView(item.categoryId)}
            >
              <FaEye />
            </button>

            <button
              className="icon-btn edit"
              title="Edit"
              onClick={() => handleEditOpen(item)}
            >
              <FaEdit />
            </button>

            <button
              className="icon-btn delete"
              title="Delete"
              onClick={() => handleDelete(item)}
            >
              <FaTrash />
            </button>
          </div>
        ),
      }))
    : [];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>CATEGORY</h2>
        <Button text="+ Add Category" color="orange" onClick={() => setOpen(true)} />
      </div>

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
          Showing <strong style={{ color: "#ff7a00" }}>{categoryList.length}</strong>{" "}
          {totalCount > categoryList.length && (
            <>of <strong>{totalCount}</strong></>
          )}{" "}
          records
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

      {/* ── Add Modal ── */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Category" size="md">
        <CategoryForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={editOpen} onClose={() => { setEditOpen(false); setEditItem(null); }} title="Edit Category" size="md">
        {editItem && (
          <CategoryForm
            onClose={() => { setEditOpen(false); setEditItem(null); }}
            onSubmit={handleUpdate}
            initialValues={{ category_name: editItem.category_name }}
          />
        )}
      </Modal>

      {/* ── View Modal ── */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="View Category" size="lg">
        {selectedItem && (
          <div style={{ padding: "10px" }}>
            <div style={{
              display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px",
              background: "#fff8f2", borderRadius: "8px", padding: "12px 16px",
              border: "1px solid #ffe0c0",
            }}>
              <div>
                <span style={{ fontWeight: 600, color: "#555" }}>Category Name: </span>
                <span>{selectedItem.category_name || "-"}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: "#555" }}>Status: </span>
                <span style={{
                  display: "inline-block", padding: "2px 10px", borderRadius: "12px",
                  fontSize: "13px", fontWeight: 600, textTransform: "capitalize",
                  background: selectedItem.category_status === "enable" ? "#d4edda" : "#f8d7da",
                  color:      selectedItem.category_status === "enable" ? "#155724" : "#721c24",
                }}>
                  {selectedItem.category_status || "-"}
                </span>
              </div>
            </div>

            <h6 style={{ fontWeight: 700, marginBottom: "10px", color: "#ff7a00" }}>
              Subcategories ({selectedItem.subcategories?.length || 0})
            </h6>

            {selectedItem.subcategories?.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ background: "#ff7a00", color: "#fff" }}>
                      <th style={thStyle}>S.No</th>
                      <th style={thStyle}>Yoga Name</th>
                      <th style={thStyle}>Client Price</th>
                      <th style={thStyle}>Trainer Price</th>
                      <th style={thStyle}>Duration</th>
                      <th style={thStyle}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem.subcategories.map((sub, idx) => (
                      <tr key={sub.yogaId || idx} style={{
                        background: idx % 2 === 0 ? "#fff" : "#fff8f2",
                        borderBottom: "1px solid #eee",
                      }}>
                        <td style={tdStyle}>{idx + 1}</td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{sub.yoga_name || "-"}</td>
                        <td style={tdStyle}>₹{sub.client_price || "-"}</td>
                        <td style={tdStyle}>₹{sub.trainer_price || "-"}</td>
                        <td style={tdStyle}>{sub.duration || "-"}</td>
                        <td style={{
                          ...tdStyle, maxWidth: "180px",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }} title={sub.yoga_desc}>
                          {sub.yoga_desc || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#999", textAlign: "center", padding: "20px 0" }}>
                No subcategories found.
              </p>
            )}

            <div className="text-end mt-3">
              <button className="btn btn-secondary" onClick={() => setViewOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

const thStyle = { padding: "10px 12px", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" };
const tdStyle = { padding: "9px 12px", textAlign: "left", verticalAlign: "middle" };

// ── Reusable form for Add + Edit ───────────────────────────────────────────
function CategoryForm({ onClose, onSubmit, initialValues }) {
  const [category_name, setCategoryName] = useState(initialValues?.category_name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category_name.trim()) return;
    onSubmit({ category_name: category_name.trim() });
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Category Name</label>
        <input
          type="text"
          className="form-control"
          value={category_name}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          required
        />
      </div>
      <div className="text-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {initialValues ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}

export default Category;