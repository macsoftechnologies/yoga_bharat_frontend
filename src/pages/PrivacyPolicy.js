import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import {
  addPrivacy,
  getPrivacyList,
  getPrivacyById,
  updatePrivacy,
  deletePrivacy,
} from "../services/authService";
import "../forms/form.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function PrivacyPolicy() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [policyList, setPolicyList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* FETCH LIST */
  const fetchPrivacy = async (page) => {
  try {
    const res = await getPrivacyList(page, 10);
    console.log("Privacy response:", res);

    let data = [];
    let pages = 1;
    if (res && Array.isArray(res.data)) {
      data = res.data;
      pages = res.totalPages || 1;
    }
    else if (Array.isArray(res)) {
      data = res;
    }

    setPolicyList(data);
    setTotalPages(pages);
  } catch (err) {
    console.error(err);
    setPolicyList([]);
    setTotalPages(1);
    Swal.fire("Error", "Failed to fetch privacy policies", "error");
  }
  };


  useEffect(() => {
    fetchPrivacy(currentPage);
  }, [currentPage]);

  /* ADD / UPDATE */
  const handleSubmit = async (data) => {
    try {
      if (selectedItem && editOpen) {
        await updatePrivacy({
          privacyId: selectedItem.privacyId,
          ...data,
        });
        Swal.fire({
          title: "Updated!",
          text: "Privacy policy updated successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          background: "#35a542",
          color: "#ffffff", 
        });
      } else {
        await addPrivacy(data);
        Swal.fire({
          title: "Added!",
          text: "Privacy policy added successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          background: "#35a542",
          color: "#ffffff", 
        });
      }
      fetchPrivacy();
      setOpen(false);
      setEditOpen(false);
      setSelectedItem(null);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  /* VIEW */
  const handleView = async (privacyId) => {
    try {
      const res = await getPrivacyById(privacyId);
      setSelectedItem(res.data);
      setViewOpen(true);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch privacy policy", "error");
    }
  };

  /* EDIT */
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  /* DELETE */
  const handleDelete = async (privacyId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This privacy policy will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#35a542", 
      cancelButtonColor: "#ff7a00",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deletePrivacy(privacyId);
      Swal.fire({
        title: "Deleted!",
        text: "Privacy policy deleted successfully",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
        background: "#ff7a00",
        color: "#ffffff",
      });
      fetchPrivacy();
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  /*TABLE  */
  const columns = [
    { header: "User Type", accessor: "usertype" },
    { header: "Text", accessor: "text" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = Array.isArray(policyList)
    ? policyList.map((item) => ({
        ...item,
        actions: (
          <div className="actions">
            <button
              className="icon-btn view"
              title="View"
              onClick={() => handleView(item.privacyId)}
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
              onClick={() => handleDelete(item.privacyId)}
            >
              <FaTrash />
            </button>
          </div>
        ),
      }))
    : [];

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Privacy Policy</h2>
        <Button text="+ Add Policy" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Policy" size="lg">
        <PolicyForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Policy" size="lg">
        <PolicyForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="View Policy" size="md">
        {selectedItem && (
          <div style={{ padding: "10px" }}>
            <p><b>User Type:</b> {selectedItem.usertype}</p>
            <p><b>Text:</b> {selectedItem.text}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* FORM*/
function PolicyForm({ onClose, initialData, isEdit, onSubmit }) {
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
        <label className="form-label">Policy Text</label>
        <textarea
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="5"
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

export default PrivacyPolicy;
