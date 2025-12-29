import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import "../forms/form.css";
import {
  addSplashScreen,
  getSplashScreens,
  getSplashScreenById,
  updateSplashScreen,
  deleteSplashScreen,
} from "../services/authService";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

/* =========================
   MAIN PAGE
========================= */
function SplashScreenPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [splashList, setSplashList] = useState([]);

  /* FETCH LIST */
  const fetchSplashScreens = async () => {
    try {
      const res = await getSplashScreens();
      setSplashList(res.data || []);
    } catch {
      Swal.fire("Error", "Failed to fetch splash screens", "error");
    }
  };

  useEffect(() => {
    fetchSplashScreens();
  }, []);

  /* VIEW ITEM */
// const handleView = async (splashscreenId) => {
//   try {
//     const res = await getSplashScreenById(splashscreenId);
//     setSelectedItem(res.data.data); // <-- important: use res.data.data
//     setViewOpen(true);
//   } catch {
//     Swal.fire("Error", "Failed to fetch details", "error");
//   }
// };
  const handleView = async (splashscreenId) => {
    try {
      const res = await getSplashScreenById(splashscreenId);
      setSelectedItem(res.data);
      setViewOpen(true);
    } catch {
      Swal.fire("Error", "Failed to fetch details", "error");
    }
  };


  /* EDIT ITEM */
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  /* DELETE ITEM */
  const handleDelete = async (splashscreenId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This splash screen will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff7a00",
      cancelButtonColor: "#28a745",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteSplashScreen(splashscreenId);
      Swal.fire({
        title: "Deleted!",
        text: res.message || "Splash screen deleted successfully",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: "#ff7a00",
        color: "#ffffff",
      });
      fetchSplashScreens();
    } catch {
      Swal.fire("Error", "Failed to delete splash screen", "error");
    }
  };

  /* ADD / UPDATE ITEM */
  const handleSubmit = async (data) => {
    try {
      let res;
      if (selectedItem && editOpen) {
        res = await updateSplashScreen({ splashscreenId: selectedItem.splashscreenId, ...data });
        Swal.fire({
          title: "Updated!",
          text: res.message || "Splash screen updated successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          background: "#35a542",
          color: "#ffffff",
        });
      } else {
        res = await addSplashScreen(data);
        Swal.fire({
          title: "Added!",
          text: res.message || "Splash screen added successfully",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          background: "#35a542",
          color: "#ffffff",
        });
      }
    } catch {
      Swal.fire("Error", "Failed to save splash screen", "error");
    } finally {
      setOpen(false);
      setEditOpen(false);
      setSelectedItem(null);
      fetchSplashScreens();
    }
  };

  /* TABLE COLUMNS */
  const columns = [
    { header: "Text", accessor: "text" },
    { header: "Screen Type", accessor: "screen_type" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = splashList.map((item) => ({
    ...item,
    actions: (
      <div className="actions">
          <button
            className="icon-btn view"
            title="View"
            onClick={() => handleView(item.splashscreenId)}
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
            onClick={() => handleDelete(item.splashscreenId)}
          >
            <FaTrash />
          </button>
        </div>
    ),
  }));

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Splash Screens</h2>
        <Button text="+ Add Splash Screen" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table columns={columns} data={tableData} rowsPerPage={10} />

      {/* ADD */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Splash Screen" size="lg">
        <SplashScreenForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      {/* EDIT */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Splash Screen" size="lg">
        <SplashScreenForm onClose={() => setEditOpen(false)} initialData={selectedItem} isEdit onSubmit={handleSubmit} />
      </Modal>

      {/* VIEW */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="View Splash Screen" size="md">
        {selectedItem && (
          <div style={{ padding: 10 }}>
            <p><b>Text:</b> {selectedItem.text}</p>
            <p><b>Screen Type:</b> {selectedItem.screen_type}</p>
            <button className="btn btn-secondary" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        )}
      </Modal>

      
    </div>
  );
}

/* =========================
   FORM COMPONENT
========================= */
function SplashScreenForm({ onClose, initialData, isEdit, onSubmit }) {
  const [text, setText] = useState(initialData?.text || "");
  const [screenType, setScreenType] = useState(initialData?.screen_type || "");

  useEffect(() => {
    if (isEdit && initialData) {
      setText(initialData.text || "");
      setScreenType(initialData.screen_type || "");
    }
  }, [initialData, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text, screen_type: screenType });
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Text</label>
        <input
          type="text"
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Screen Type</label>
        <select
          className="form-control"
          value={screenType}
          onChange={(e) => setScreenType(e.target.value)}
          required
        >
          <option value="">Select Screen Type</option>
          <option value="client">Client</option>
          <option value="trainer">Trainer</option>
        </select>
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

export default SplashScreenPage;
