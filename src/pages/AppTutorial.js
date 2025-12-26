import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import {
  addAppTutorial,
  getAppTutorials,
  getAppTutorialById,
  updateAppTutorial,
  deleteAppTutorial,
} from "../services/authService";
import "../forms/form.css";

function AppTutorial() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tutorialsList, setTutorialsList] = useState([]);

  /* =========================
     FETCH TUTORIAL LIST
  ========================= */
  const fetchTutorials = async () => {
    try {
      const res = await getAppTutorials();

      // 🔑 map backend user_type → frontend usertype
      const mappedData = (res.data || []).map(item => ({
        ...item,
        usertype: item.usertype || item.user_type || "",
      }));

      setTutorialsList(mappedData);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch tutorials", "error");
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  /* =========================
     VIEW TUTORIAL
  ========================= */
  const handleView = async (appId) => {
    try {
      const res = await getAppTutorialById(appId);
      setSelectedItem({
        ...res.data,
        usertype: res.data.usertype || res.data.user_type || "",
      });
      setViewOpen(true);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch tutorial details", "error");
    }
  };

  /* =========================
     EDIT TUTORIAL
  ========================= */
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  /* =========================
     DELETE TUTORIAL
  ========================= */
  const handleDelete = async (appId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This tutorial will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#35a542",
      cancelButtonColor: "#ff7a00",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteAppTutorial(appId);
      Swal.fire({
        title: "Deleted!",
        text: "Tutorial deleted successfully",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
        background: "#ff7a00",
        color: "#ffffff",
      });
      fetchTutorials();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
    }
  };

  /* =========================
     ADD / UPDATE
  ========================= */
  const handleSubmit = async (formData) => {
    try {
      if (selectedItem && editOpen) {
        formData.append("appId", selectedItem.appId);
        await updateAppTutorial(formData);
        Swal.fire({
          title: "Updated!",
          text: "Tutorial updated successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          background: "#28a745",
          color: "#ffffff",
        });
      } else {
        await addAppTutorial(formData);
        Swal.fire({
          title: "Added!",
          text: "Tutorial added successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          background: "#28a745",
          color: "#ffffff",
        });
      }

      fetchTutorials();
      setOpen(false);
      setEditOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  /* =========================
     TABLE CONFIG
  ========================= */
  const columns = [
    { header: "User Type", accessor: "usertype" },
    { header: "Tutorial Image", accessor: "app_image" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = tutorialsList.map((item) => ({
    ...item,
    app_image: item.app_image ? (
      <img
        src={process.env.REACT_APP_API_BASE_URL + "/" + item.app_image}
        alt={item.usertype}
        width="60"
        height="60"
      />
    ) : (
      "No Image"
    ),
    actions: (
      <div className="actions">
        <button className="view" onClick={() => handleView(item.appId)}>View</button>
        <button className="edit" onClick={() => handleEdit(item)}>Edit</button>
        <button className="delete" onClick={() => handleDelete(item.appId)}>Delete</button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>APP TUTORIALS</h2>
        <Button text="+ Add Tutorial" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={tableData} rowsPerPage={10} />

      {/* ADD MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Tutorial" size="lg">
        <AppTutorialForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Tutorial" size="lg">
        <AppTutorialForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* VIEW MODAL */}
        <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="View Tutorial" size="md">
        {selectedItem && (
          <div style={{ padding: "10px" }}>
            <p><b>User Type:</b> {selectedItem.usertype}</p>
            <p>
              <b>Tutorial Image:</b>{" "}
              {selectedItem.app_image ? (
                <img
                  src={process.env.REACT_APP_API_BASE_URL + "/" + selectedItem.app_image}
                  alt={selectedItem.usertype}
                  width="200"
                />
              ) : (
                "No Image"
              )}
            </p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* =========================
   FORM
   usertype → ADD ONLY
========================= */
function AppTutorialForm({ onClose, initialData, isEdit, onSubmit }) {
  const [usertype, setUsertype] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // ✅ usertype ONLY FOR ADD
    if (!isEdit) {
      formData.append("usertype", usertype);
    }

    // image logic unchanged
    if (imageFile) {
      formData.append("app_image", imageFile);
    } else if (initialData?.app_image && isEdit) {
      formData.append("app_image", initialData.app_image);
    }

    onSubmit(formData);
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      
      {/* ADD ONLY */}
      {!isEdit && (
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
      )}

      <div className="mb-3">
        <label className="form-label">Tutorial Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
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

export default AppTutorial;
