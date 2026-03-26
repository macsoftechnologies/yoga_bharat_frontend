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
  const [totalCount, setTotalCount] = useState(0); // ✅ Total records
  const [limit, setLimit] = useState(10); // ✅ Records per page
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeatures(currentPage, limit);
  }, [currentPage, limit]);

  const fetchFeatures = async (page, limitValue) => {
    setLoading(true);
    try {
      const res = await getFeatures(page, limitValue);
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

      setFeaturesList(data);
      setTotalPages(pages);
      setTotalCount(total);
    } catch (err) {
      setFeaturesList([]);
      setTotalPages(1);
      setTotalCount(0);
      Swal.fire("Error", "Failed to fetch features", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleView = async (featureId) => {
    try {
      const res = await getFeatureById(featureId);
      setSelectedItem(res.data);
      setViewOpen(true);
    } catch (err) {
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
      fetchFeatures(currentPage, limit);
    } catch (err) {
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
      fetchFeatures(currentPage, limit);
      setOpen(false);
      setEditOpen(false);
      setSelectedItem(null);
    } catch (err) {
      Swal.fire("Error", "Operation failed", "error");
    }
  };

  const columns = [
    { header: "S.No", accessor: "srNo" },
    { header: "User Type", accessor: "usertype" },
    { header: "Feature Image", accessor: "feature_image" },
    { header: "Link", accessor: "link" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData = Array.isArray(featuresList)
    ? featuresList.map((item, index) => ({
        srNo: (currentPage - 1) * limit + index + 1,
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
        link: item.link ? (
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            View More
          </a>
        ) : (
          "No Link"
        ),
        actions: (
          <div className="actions">
            <button className="icon-btn view" title="View" onClick={() => handleView(item.featureId)}>
              <FaEye />
            </button>
            <button className="icon-btn edit" title="Edit" onClick={() => handleEdit(item)}>
              <FaEdit />
            </button>
            <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(item.featureId)}>
              <FaTrash />
            </button>
          </div>
        ),
      }))
    : [];

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>BANNERS</h2>
        <Button text="+ Add Feature" color="orange" onClick={() => setOpen(true)} />
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
          Showing <strong style={{ color: "#ff7a00" }}>{featuresList.length}</strong>{" "}
          {totalCount > featuresList.length && <>of <strong>{totalCount}</strong></>} records
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

      <Modal open={open} onClose={() => setOpen(false)} title="Add Feature" size="md">
        <FeatureForm onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Feature" size="md">
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
            <p>
              <b>Link:</b>{" "}
              {selectedItem.link ? (
                <a href={selectedItem.link} target="_blank" rel="noopener noreferrer">
                  Open Link
                </a>
              ) : (
                "No Link"
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

function FeatureForm({ onClose, initialData, isEdit, onSubmit }) {
  const [usertype, setUsertype] = useState(initialData?.usertype || "");
  const [imageFile, setImageFile] = useState(null);
  const [link, setLink] = useState(initialData?.link || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (!isEdit) {
      formData.append("usertype", usertype);
    }
    if (imageFile) {
      formData.append("feature_image", imageFile);
    }
    if (link) {
      formData.append("link", link);
    }
    if (onSubmit) onSubmit(formData);
    onClose();
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {!isEdit && (
        <div className="mb-3">
          <label className="form-label">User Type</label>
          <select
            className="form-select"
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

      <div className="mb-3">
        <label className="form-label">Link</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter URL or video link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
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