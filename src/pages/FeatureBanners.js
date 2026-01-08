import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import {
  addFeature,
  getFeatures,
  getFeatureById,
  updateFeature,
  deleteFeature,
} from "../services/authService";
import "../forms/form.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function FeatureBanners() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [featuresList, setFeaturesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
    fetchFeatures(currentPage);
  }, [currentPage]);

  const fetchFeatures = async (page) => {
  try {
    const res = await getFeatures(page, 10);
    console.log("Features response:", res);

    let data = [];
    let pages = 1;
    if (res && Array.isArray(res.data)) {
      data = res.data;
      pages = res.totalPages || 1;
    }
    else if (Array.isArray(res)) {
      data = res;
    }

    setFeaturesList(data);
    setTotalPages(pages);
  } catch (err) {
    console.error(err);
    setFeaturesList([]);
    setTotalPages(1);
    Swal.fire("Error", "Failed to fetch features", "error");
  }
  };

  const handleView = async (featureId) => {
    try {
      const res = await getFeatureById(featureId);
      setSelectedItem(res.data);
      setViewOpen(true);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch feature details", "error");
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleDelete = async (featureId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This feature will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#35a542",
      cancelButtonColor: "#ff7a00",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteFeature(featureId);
      Swal.fire({
        title: "Deleted!",
        text: "Feature deleted successfully",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
        background: "#ff7a00",
        color: "#ffffff",
      });
      fetchFeatures();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedItem && editOpen) {
        formData.append("featureId", selectedItem.featureId);
        await updateFeature(formData);
        Swal.fire({
          title: "Updated!",
          text: "Feature updated successfully",
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
        await addFeature(formData);
        Swal.fire({
          title: "Added!",
          text: "Feature added successfully",
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
      fetchFeatures();
      setOpen(false);
      setEditOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Operation failed", "error");
    }
  };
  const columns = [
    { header: "User Type", accessor: "usertype" },
    { header: "Feature Image", accessor: "feature_image" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = Array.isArray(featuresList)
    ? featuresList.map((item) => ({
        ...item,
        feature_image: item.feature_image ? (
          <img
            src={process.env.REACT_APP_API_BASE_URL + "/" + item.feature_image}
            alt={item.usertype}
            width="60"
            height="60"
          />
        ) : (
          "No Image"
        ),
        actions: (
          <div className="actions">
            <button
              className="icon-btn view"
              title="View"
              onClick={() => handleView(item.featureId)}
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
              onClick={() => handleDelete(item.featureId)}
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
        <h2>Feature Banners</h2>
        <Button text="+ Add Feature" color="orange" onClick={() => setOpen(true)} />
      </div>

      <Table
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Feature" size="lg">
        <FeatureForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Feature" size="lg">
        <FeatureForm
          onClose={() => setEditOpen(false)}
          initialData={selectedItem}
          isEdit
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="View Feature" size="md">
        {selectedItem && (
          <div style={{ padding: "10px" }}>
            <p><b>User Type:</b> {selectedItem.usertype}</p>
            <p>
              <b>Feature Image:</b>{" "}
              {selectedItem.feature_image ? (
                <img
                  src={process.env.REACT_APP_API_BASE_URL + "/" + selectedItem.feature_image}
                  alt={selectedItem.usertype}
                  width="200"
                />
              ) : (
                "No Image"
              )}
            </p>
            <button className="btn btn-secondary mt-2" onClick={() => setViewOpen(false)}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* FORM */

function FeatureForm({ onClose, initialData, isEdit, onSubmit }) {
  const [usertype, setUsertype] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // ✅ usertype ONLY for ADD
    if (!isEdit) {
      formData.append("usertype", usertype);
    }

    if (imageFile) {
      formData.append("feature_image", imageFile);
    }

    if (onSubmit) onSubmit(formData);
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {/* SHOW ONLY FOR ADD */}
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
        <label className="form-label">Feature Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
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

export default FeatureBanners;
